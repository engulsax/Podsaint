const express = require('express')
const categoryBL = require('../../bl/category-bl')
const router = express.Router()

router.get('/', function (request, response) {
    (async function () {
        model = {
            categories: await categoryBL.getCategoriesDetails()
        }
        response.render("home.hbs", { model })
    })()
})

router.get('/home', function (request, response) {
    (async function () {
        model = {
            categories: await categoryBL.getCategoriesDetails()
        }
        response.render("feed.hbs", { model })
    })()
})


module.exports = router