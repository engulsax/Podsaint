const express = require('express')
const categoryBL = require('../../bl/category-bl')
const searchBL = require('../../bl/search-bl')
const podcastBL = require('../../bl/podcast-bl')
const router = express.Router()




router.get('/:id', function (request, response) {
    (async function () {

        const collectionId = request.params.id
        const information = await searchBL.searchPodcast(collectionId)
        const categories = await categoryBL.getCategoriesDetails()
        model = {
            collectionId: collectionId,
            information: information.results,
            categories: categories
        }
        response.render("podcast.hbs", { model })
    })()
})

router.get('/:id/write-review', function (request, response) {
    (async function () {
        const collectionId = request.params.id
        const information = await searchBL.searchPodcast(collectionId)
        const categories = await categoryBL.getCategoriesDetails()
        model = {
            collectionId: collectionId,
            information: information.results,
            categories: categories
        }
        response.render("write-review.hbs", { model })
    })()
})

router.post('/:id/write-review', function (request, response) {
    
    (async function(){
        const collectionId = request.params.id
        const humorRating = parseInt(request.body.humorRating)
        const factRating = parseInt(request.body.factRating)
        const productionQualty = parseInt(request.body.productionQuality)
        const overallRating = parseInt(request.body.overallRating)
        const reviewText = request.body.reviewText
        const seriousnessRating = parseInt(request.body.seriousnessRating)
        console.log(collectionId)
        console.log(humorRating)
        console.log(factRating)
        console.log(productionQualty)
        console.log(overallRating)
        console.log(reviewText)
        console.log(seriousnessRating)
        const post = await podcastBL.newPodcastReview(collectionId,humorRating,factRating,productionQualty,overallRating,reviewText,seriousnessRating)
        console.log(post)
    })()
        
})

module.exports = router