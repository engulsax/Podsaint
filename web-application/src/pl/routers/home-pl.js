const express = require('express')
const categoryBL = require('../../bl/category-bl')
const searchBL = require('../../bl/search-bl')
const router = express.Router()

/*NOT LOGGED IN*/
router.get('/', function (request, response) {
    (async function () {
        
        const mainPodcasts = await searchBL.searchPodcasts('podcast')

        model = {
            categories: await categoryBL.getCategoriesDetails(),
            mainPodcasts: mainPodcasts.results
           
        }

        console.log(model.mainPodcasts)

        response.render("home.hbs", { model })
    })()
})

/*LOGGED IN*/
router.get('/home', function (request, response) {
    (async function () {
        model = {
            categories: await categoryBL.getCategoriesDetails()
        }
        response.render("feed.hbs", { model })
    })()
})


module.exports = router