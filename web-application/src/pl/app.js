const express = require('express')
const expressHandlebars = require('express-handlebars')
const categoryPL = require('./routers/category-pl')
const searchPL = require('./routers/search-pl')
const homePL = require('./routers/home-pl')
const podcastPL = require('./routers/podcast-pl')

const app = express()

app.use(express.static(__dirname + "/public"))

app.set("views", "src/pl/views")

app.engine('hbs', expressHandlebars({
  extname: ".hbs",
  defaultLayout: "layout",
}))

/*---------------------------------ROUTERS-------------------------------------*/
app.use("/", homePL)
app.use("/category", categoryPL)
app.use("/search", searchPL)
app.use("/podcast", podcastPL)

app.listen(8080, function(){
  console.log("Web application listening on port 8080.")
})