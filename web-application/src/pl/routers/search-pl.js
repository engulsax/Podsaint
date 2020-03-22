const express = require('express')
const router = express.Router()
const err = require('../../errors/error')


module.exports = function ({ categoryBL, searchItunesBL }) {

    router.get('/', function (request, response) {
        response.redirect('/search/itunes')
    })

    router.get('/itunes', async function (request, response) {
        
        const model = response.model
        try{
            const searchText = request.query.searchText
            const searchResponse = await searchItunesBL.searchPodcasts(searchText)
    
            model.categories = await categoryBL.getCategoriesDetails()
            model.prevSearchText = searchText
            model.result = searchResponse.results
            model.category = "Search for all podcasts"
            model.id = ""
        F
        response.render('search.hbs', model)

        } catch(error){
            if(error == err.err.PODCAST_FETCH_ERROR){
                model.searchError = err.err.PODCAST_FETCH_ERROR
                response.render('search.hbs', model)
            }
        }
    })

    router.get('/itunes/:id', async function (request, response) {
        
        const model = response.model

        try {
            const categoryId = request.params.id
            const searchText = request.query.searchText
            const categoryOption = request.query.category
            const searchResponse = await searchItunesBL.searchPodcastsWithIdAndTerm(searchText, categoryOption, categoryId)
            const currentCategoryDetails = await categoryBL.getCategoryDetails(categoryId)

            categories = await categoryBL.getCategoriesDetails()
            id = categoryId
            currentCategoryDetails = currentCategoryDetails
            prevSearchText = searchText
            category = currentCategoryDetails.category
            subCategories = currentCategoryDetails.subCategories
            result = searchResponse.results

            response.render('search.hbs', model)

        } catch (error) {
            if (error == err.err.PODCAST_FETCH_ERROR) {
                model.searchError = err.err.PODCAST_FETCH_ERROR
                response.render('search.hbs', model)
            }
        }
    })

    return router
}
