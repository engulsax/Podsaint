const express = require('express')
const router = express.Router()

module.exports = function ({ categoryBL, searchItunesBL, searchPodsaintBL, podcastBL }) {

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

            response.render('search.hbs', { model })
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

            response.render('search.hbs', { model })
        })()
    })


    /*Searching on podsaint*/
    router.get('/podsaint', function (request, response) {
        (async function () {
            const searchText = request.query.searchText
            const categoryOption = request.query.category

            const toneRating = request.query.podcastTone
            const topicRelevenceRating = parseInt(request.query.topicRelevenceRating)
            const productionQualty = parseInt(request.query.productionQuality)
            const overallRating = parseInt(request.query.overallRating)

            const searchResponse = await searchPodsaintBL.getSearchMatch(
                categoryOption,
                searchText,
                toneRating,
                topicRelevenceRating,
                productionQualty,
                overallRating
            )

            const model = {
                categories: await categoryBL.getCategoriesDetails(),
                result: searchResponse,
                prevSearchText: searchText,
                category: "Search for all podcasts",
                id: ""
            }

            response.render('search.hbs', { model })
        })()
    })

    router.use('/podsaint/:id', function (request, responsen, next) {

        //INPUT HANDLE HERE
    })

    router.get('/podsaint/:id', function (request, response) {
        (async function () {
            const categoryId = request.params.id
            const searchText = request.query.searchText
            const categoryOption = request.query.category

            const toneRating = request.query.podcastTone
            const topicRelevenceRating = parseInt(request.query.topicRelevenceRating)
            const productionQualty = parseInt(request.query.productionQuality)
            const overallRating = parseInt(request.query.overallRating)

            const searchResponse = await searchPodsaintBL.getSearchMatch(
                categoryOption,
                searchText,
                toneRating,
                topicRelevenceRating,
                productionQualty,
                overallRating
            )

            const currentCategoryDetails = await categoryBL.getCategoryDetails(categoryId),

                model = {
                    categories: await categoryBL.getCategoriesDetails(),
                    prevSearchText: searchText,
                    id: categoryId,
                    currentCategoryDetails: currentCategoryDetails,
                    category: currentCategoryDetails.category,
                    subCategories: currentCategoryDetails.subCategories,
                    result: searchResponse
                }

            response.render('search.hbs', { model })
        })()
    })

    return router
}
