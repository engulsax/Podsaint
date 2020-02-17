const express = require('express')
const bodyParser = require('body-parser')
const expressHandlebars = require('express-handlebars')
const redis = require('redis')
const session = require('express-session')

const categoryPL = require('./routers/category-pl')
const searchPL = require('./routers/search-pl')
const homePL = require('./routers/home-pl')
const podcastPL = require('./routers/podcast-pl')

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname + "/public"))
app.set("views", "src/pl/views")
app.engine('hbs', expressHandlebars({
  extname: ".hbs",
  defaultLayout: "layout",
}))

let redisClient = redis.createClient(6379, 'podsaint_redis_1')

var RedisStore = require('connect-redis')(session)


app.use(session({
	secret: "ldasdgewbodkodkfkrsldfsbgtdhhtyu",
	store: new RedisStore({client: redisClient }),
	saveUninitialized: false,
	resave: false
}))


app.use(function(request, response, next){
	console.log("---------sessionmiddleware")
	console.log(request.session)
	console.log(request.session.key)
	next()

	
})

/*---------------------------------ROUTERS-------------------------------------*/
app.use("/", homePL)
app.use("/category", categoryPL)
app.use("/search", searchPL)
app.use("/podcast", podcastPL)


app.listen(8080, function(){
  console.log("Web application listening on port 8080.")
})