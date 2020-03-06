const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const express = require('express')
const bodyParser = require('body-parser')
const expressHandlebars = require('express-handlebars')
//const svgstore = require('svgstore')
//const fs = require('fs');
const redis = require('redis')
const session = require('express-session')
const container = require('../main.js')
const err = require('../errors/error')

const app = express()


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + "/public"))
app.use(cookieParser())
app.use(csrf({ cookie: true }))
app.set("views", "src/pl/views")


/*TODO REMOVE SVG FILES, USE PNG INSTEAD, WILL WORK THE SAME FOR ME*/
/*LOADING SVG FILES*/
/*
const sprites = svgstore([{ cleanDefs: 'true' }, { cleanSymbols: 'true' }])
  .add('funny', fs.readFileSync(__dirname + '/public/sprites/funny.svg', 'utf8'))
  .add('serious', fs.readFileSync(__dirname + '/public/sprites/serious.svg', 'utf8'))

fs.writeFileSync(__dirname + '/public/sprites/sprites.svg', sprites);
*/

app.engine('hbs', expressHandlebars({
  extname: ".hbs",
  defaultLayout: "layout",
  helpers: {
    rating: function (value) {

      let maxValue = 5
      let starRatings = ""
      for (let i = 0; i < value; i += 1) {
        starRatings += '<span class="fa fa-star checked"></span>'
        maxValue -= 1
      }
      for (let i = 0; i < maxValue; i += 1) {
        starRatings += '<span class="fa fa-star"></span>'
      }
      return starRatings
    }
  }
}))

let redisClient = redis.createClient(6379, 'podsaint_redis_1')
let RedisStore = require('connect-redis')(session)

app.use(session({
  secret: "ldasdgewbodkodkfkrsldfsbgtdhhtyu",
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: false,
  resave: false
}))

/*
app.use(function(request, response, next){
	console.log("---------test session middleware test-------------")
	console.log(request.session)
	console.log(request.session.key)
	next()
})*/

/*---------------------------------ROUTERS-------------------------------------*/

app.use("/", container.resolve('homePL'))
app.use("/category", container.resolve('categoryPL'))
app.use("/search", container.resolve('searchPL'))
app.use("/podcast", container.resolve('podcastPL'))
app.use("/my-review", container.resolve('myReviewPL'))

/*YOU DO NOT GET THE CATEGORIES HERE :( */
app.use(async function (request, response, next) {
  response.model = {
    //categories: await categoryBL.getCategoriesDetails(),
    loggedIn: (request.session.key)
  }
  next()
})

//ERROR HANDLING
app.use(function (request, response, next) {

  const model = {}

  response.status(404)
  model.error = "Page Not Found"
  model.code = "404"
  response.render('error.hbs', model)
})

app.use(function (error, request, response, next) {

  const model = {}

  console.log(error)
  if (err.errorNotExist(error)) {
    error = err.err.INTERNAL_SERVER_ERROR
  }

  const code = err.getErrCode(error)

  response.status(code)


  if (code === 401) {
    const inputErrors = []
    model.inputErrors = inputErrors.concat(error)
    response.render("signin.hbs", model)

  } else {
    model.code = code
    model.error = error
    response.render('error.hbs', model)
  }

})

app.listen(8080, function () {
  console.log("Web application listening on port 8080.")
})

