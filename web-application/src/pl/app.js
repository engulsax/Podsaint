const express = require('express')
const expressHandlebars = require('express-handlebars')
const categoryBL = require('../bl/category-bl') //CHANGE THIS!
const categoryPL = require('./category-pl')
const searchPL = require('./search-pl')


const app = express()

app.use(express.static(__dirname + "/public"))

app.set("views", "src/pl/views")

app.engine('hbs', expressHandlebars({
  extname: ".hbs",
  defaultLayout: "layout",
}))

const model = {}

const getCategories = async function (request, response, next) {
  model.categories = await categoryBL.getCategoriesDetails() //COME UP WITH ALTERNATIVE!!
  next()
}

app.use(getCategories)

app.get('/', function (request, response) {
  response.render("home.hbs", { model })
})

/*---------------------------------ROUTERS-------------------------------------*/
app.use("/category", categoryPL)
app.use("/search", searchPL)

app.get('/feed', function(request, response){

  response.render("feed.hbs")
})

app.get('/podcast', function(request,response){
  response.render("podcast.hbs")
})
app.get('/write-review', function(request,response){
  response.render('write-review.hbs')
})

app.listen(8080, function(){
  console.log("Web application listening on port 8080.")
})