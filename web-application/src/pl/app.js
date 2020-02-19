const express = require('express')
const bodyParser = require('body-parser')
const expressHandlebars = require('express-handlebars')
const redis = require('redis')
const session = require('express-session')
const container = require('../main.js')

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



app.listen(8080, function(){
  console.log("Web application listening on port 8080.")
})