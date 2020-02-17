const express = require('express')
const bodyParser = require('body-parser')
const expressHandlebars = require('express-handlebars')
var svgstore = require('svgstore');
var fs = require('fs');


const categoryPL = require('./routers/category-pl')
const searchPL = require('./routers/search-pl')
const homePL = require('./routers/home-pl')
const podcastPL = require('./routers/podcast-pl')


const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + "/public"))
app.set("views", "src/pl/views")

/*LOADING SVG FILES*/
var sprites = svgstore([{ cleanDefs: 'true' }, { cleanSymbols: 'true' }])
  .add('funny', fs.readFileSync(__dirname + '/public/sprites/funny.svg', 'utf8'))
  .add('serious', fs.readFileSync(__dirname + '/public/sprites/serious.svg', 'utf8'))

fs.writeFileSync(__dirname + '/public/sprites/sprites.svg', sprites);


//TODO put helper in own file
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


/*---------------------------------ROUTERS-------------------------------------*/
app.use("/", homePL)
app.use("/category", categoryPL)
app.use("/search", searchPL)
app.use("/podcast", podcastPL)


app.listen(8080, function () {
  console.log("Web application listening on port 8080.")
})