const express = require('express')

module.exports = function ({ categoryBL , searchBL }) {
    
   
    const router = express.Router()

    router.get('/:id', function (request, response) {
        (async function () {

            const mainCategoryId = request.params.id
            const currentCategoryDetails = await categoryBL.getCategoryDetails(mainCategoryId)
            const mainPodcasts = await searchBL.searchPodcastsWithId(mainCategoryId)

            const categoryLists = []
            for (category of currentCategoryDetails.subCategories) {
                searchResponse = await searchBL.searchPodcastsWithId(category.id)
                categoryList = {}
                categoryList.category = category.category
                categoryList.subCategories = searchResponse.results
                categoryLists.push(categoryList)
            }

            const model = {
                categories: await categoryBL.getCategoriesDetails(),
                category: currentCategoryDetails.category,
                mainPodcasts: mainPodcasts.results,
                id: currentCategoryDetails.id,
                categoryLists: categoryLists,
                subCategories: currentCategoryDetails.subCategories,
            }

            response.render('category.hbs', { model })
        })()
    })
    
    return router
}