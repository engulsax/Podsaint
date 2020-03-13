const express = require('express')
const router = express.Router()

module.exports = function ({ categoryBL, searchItunesBL }) {

    router.get('/:id', async function (request, response, next) {
        try{
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

            response.render('category.hbs', model )
        } catch(error) {
            next(error)
        }
    })

    return router
}