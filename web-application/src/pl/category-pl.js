const express = require('express')
const categoryBL = require('../bl/category-bl')
const searchBL = require('../bl/search-bl')
const router = express.Router()

router.get('/:id', function (request, response) {
    (async function(){
        const mainCategoryId = request.params.id
        const currentCategoryDetails = await categoryBL.getCategoryDetails(mainCategoryId)

        const categoryLists = []
        for(category of currentCategoryDetails.subCategories){
            searchResponse = await searchBL.searchPodcastsWithId(category.id)
            //currentSubCategoryDetails.push(searchResponse.results)
            categoryList = {}
            categoryList.category = category.category
            categoryList.subCategories = searchResponse.results
            categoryLists.push(categoryList)
        }
        
        const model = {
            categories: await categoryBL.getCategoriesDetails(),
            category: currentCategoryDetails.category,
            id: currentCategoryDetails.id,
            categoryLists: categoryLists,
            subCategories: currentCategoryDetails.subCategories,
            //subCategoryDetails: currentSubCategoryDetails
        }

        console.log(categoryLists)
        response.render('category.hbs', {model})
    })()
})

module.exports = router