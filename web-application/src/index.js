const express = require('express')
const mainApp = require('./pl/mainApp')
const restAPI = require('./restAPI/restAPI')

const app = express()

app.use('/api', restAPI)
app.use('/', mainApp)

app.listen(8080, function () {
    console.log("Web application listening on port 8080.")
})