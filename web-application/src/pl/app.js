const express = require('express')
const expressHandlebars = require('express-handlebars')

const app = express()

app.use(express.static(__dirname + "/public"))

app.set("views", "src/pl/views")

app.engine('hbs', expressHandlebars({
  extname: ".hbs",
  defaultLayout: "layout",
}))

app.get('/', function(request, response){
  response.render("home.hbs")
})

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