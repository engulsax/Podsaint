const express = require('express')
const categoryBL = require('../../bl/category-bl')
const searchBL = require('../../bl/search-bl')
const router = express.Router()

router.get('/', function (request, response) {
    (async function () {
        const searchText = request.query.searchText
        const categoryOption = request.query.category
        const searchResponse = await searchBL.searchPodcasts(searchText)

        const model = {
            result: searchResponse.results,
            headText: "Search for all podcasts",
            id: ""
        }

        response.render('search.hbs', { model })
    })()
})

router.get('/:id', function (request, response) {
    (async function () {
        const categoryId = request.params.id
        const searchText = request.query.searchText
        const categoryOption = request.query.category
        const searchResponse = await searchBL.searchPodcastsWithIdAndTerm(searchText, categoryOption, categoryId)
        const currentCategoryDetails = await categoryBL.getCategoryDetails(categoryId),

        model = {
            id: categoryId,
            currentCategoryDetails: currentCategoryDetails,
            headText: currentCategoryDetails.category,
            subCategories: currentCategoryDetails.subCategories,
            result: searchResponse.results
        }

        response.render('search.hbs', { model })
    })()
})

module.exports = router