const express = require('express')
const categoryBL = require('../bl/category-bl')
const searchBL = require('../bl/search-bl')
const bodyPraser = require('body-parser')
const router = express.Router()

/*THIS IS REPETION OF CODE (SEE SAME CODE IN app.js), TODO: REMOVE AND MAKE BETTER*/
const model = {}

const getCategories = async function (request, response, next) {
    model.categories = await categoryBL.getCategoriesDetails()
    next()
}

router.use(getCategories)

router.get('/', function (request, response) {
    (async function(){
        const searchText = request.query.searchText
        const categoryOption = request.query.category
        const searchResponse = await searchBL.searchPodcasts(searchText)

        model.result = searchResponse.results
        model.headText = "Search for all podcasts"
        model.id = ""

        response.render('search.hbs', {model})
    })()
})

router.get('/:id', function (request, response) {
    (async function(){

        const id = request.params.id
        const currentCategoryDetails = await categoryBL.getCategoryDetails(id)
        model.id = id
        model.headText = currentCategoryDetails.category
        model.subCategories = currentCategoryDetails.subCategories

        const searchText = request.query.searchText
        const categoryOption = request.query.category
        const searchResponse = await searchBL.searchPodcastsWithIdAndTerm(searchText, categoryOption, id)

        model.result = searchResponse.results

        response.render('search.hbs', {model})
    })()
})

module.exports = router