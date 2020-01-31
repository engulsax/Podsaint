const express = require('express')
const expressHandlebars = require('express-handlebars')
const categoryBL = require('../bl/category-bl')
const categoryPL = require('./category-pl')


const app = express()

app.use(express.static(__dirname + "/public"))

app.set("views", "src/pl/views")

app.engine('hbs', expressHandlebars({
  extname: ".hbs",
  defaultLayout: "layout",
}))

const model = {}

const getCategories = async function (request, response, next) {
  model.categories = await categoryBL.getCategoriesDetails()
  //.log(await categoryBL.getCategoryDetails('1301'))
  next()
}

app.use(getCategories)

app.get('/', function (request, response) {
  response.render("home.hbs", { model })
})

/*---------------------------------ROUTERS-------------------------------------*/
app.use("/category", categoryPL)


app.listen(8080, function () {
  console.log("Web application listening on port 8080.")
})