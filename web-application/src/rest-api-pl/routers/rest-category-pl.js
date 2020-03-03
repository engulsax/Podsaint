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

    router.get('/:id', function (request, response) {
        (async function () {

            const mainCategoryId = request.params.id
            const currentCategoryDetails = await categoryBL.getCategoryDetails(mainCategoryId)
            const mainPodcasts = await searchItunesBL.searchPodcastsWithId(mainCategoryId)

            /*MOVE TO BL*/
            const categoryLists = []
            for (category of currentCategoryDetails.subCategories) {
                searchResponse = await searchItunesBL.searchPodcastsWithId(category.id)
                categoryList = {}
                categoryList.category = category.category
                categoryList.subCategories = searchResponse.results
                categoryLists.push(categoryList)
            }

            const model = response.model
            model.category = currentCategoryDetails.category
            model.mainPodcasts = mainPodcasts.results
            model.id = currentCategoryDetails.id
            model.categoryLists = categoryLists
            model.subCategories = currentCategoryDetails.subCategories

            response.status(200).json(model)
        })()
    })

    return router
}