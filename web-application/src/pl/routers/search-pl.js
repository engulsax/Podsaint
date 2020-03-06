const express = require('express')
const router = express.Router()

module.exports = function ({ categoryBL, searchItunesBL }) {

    router.use(async function (request, response, next) {
        response.model = {
            categories: await categoryBL.getCategoriesDetails(),
            loggedIn: (request.session.key)
        }
        next()
    })

    router.get('/', function (request, response) {
        response.redirect('/search/itunes')
    })

    router.get('/itunes', function (request, response) {
        (async function () {
            const searchText = request.query.searchText
            const searchResponse = await searchItunesBL.searchPodcasts(searchText)

            searchResponse.results
            const model = {
                categories: await categoryBL.getCategoriesDetails(),
                prevSearchText: searchText,
                result: searchResponse.results,
                category: "Search for all podcasts",
                id: ""
            }

            response.render('search.hbs',  model )
            
        })()
    })

    router.get('/itunes/:id', function (request, response) {
        (async function () {
            const categoryId = request.params.id
            const searchText = request.query.searchText
            const categoryOption = request.query.category
            const searchResponse = await searchItunesBL.searchPodcastsWithIdAndTerm(searchText, categoryOption, categoryId)
            const currentCategoryDetails = await categoryBL.getCategoryDetails(categoryId)

                model = {
                    categories: await categoryBL.getCategoriesDetails(),
                    id: categoryId,
                    currentCategoryDetails: currentCategoryDetails,
                    prevSearchText: searchText,
                    category: currentCategoryDetails.category,
                    subCategories: currentCategoryDetails.subCategories,
                    result: searchResponse.results
                }

            response.render('search.hbs', model )
        })()
    })

    return router
}
