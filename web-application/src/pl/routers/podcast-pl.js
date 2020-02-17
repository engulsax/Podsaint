const express = require('express')
const categoryBL = require('../../bl/category-bl')
const searchBL = require('../../bl/search-bl')
const podcastBL = require('../../bl/podcast-bl')
const router = express.Router()

router.get('/:id', function (request, response) {
    (async function () {

        const collectionId = request.params.id
        const informationRespons = await searchBL.searchPodcast(collectionId)
        const information = informationRespons.results
        const mainCategoryId = information[0].genreIds[0]
        const podcastsInSameCategory = await searchBL.searchPodcastsWithId(mainCategoryId)
        const description = await categoryBL.fetchPodInfo(information[0].collectionViewUrl)
        const reviews = await podcastBL.getAllReviewsByPodcastId(collectionId)

        console.log(reviews)


        const model = {
            categories: await categoryBL.getCategoriesDetails(),
            reviews: reviews,
            collectionId: collectionId,
            information: information,
            podcastsInSameCategory: podcastsInSameCategory.results,
            description: description
        }

        response.render("podcast.hbs", { model })
    })()
})

router.get('/:id/write-review', function (request, response) {
    (async function () {

        const collectionId = request.params.id
        const informationRespons = await searchBL.searchPodcast(collectionId)
        const information = informationRespons.results
        const mainCategoryId = information[0].genreIds[0]
        const podcastsInSameCategory = await searchBL.searchPodcastsWithId(mainCategoryId)
        const description = await categoryBL.fetchPodInfo(information[0].collectionViewUrl)

        const model = {
            categories: await categoryBL.getCategoriesDetails(),
            collectionId: collectionId,
            information: information,
            podcastsInSameCategory: podcastsInSameCategory.results,
            description: description
        }

        response.render("write-review.hbs", { model })
    })()
})


router.post('/:id/write-review', function (request, response) {

    (async function () {

        const collectionId = request.params.id
        const toneRating = parseInt(request.body.podcastTone)
        const topicRelevenceRating = parseInt(request.body.topicRelevenceRating)
        const productionQualty = parseInt(request.body.productionQuality)
        const overallRating = parseInt(request.body.overallRating)
        const reviewText = request.body.reviewText

        await podcastBL.newPodcastReview(
            collectionId, toneRating, topicRelevenceRating, productionQualty,
            overallRating, reviewText
        )
        response.redirect("/podcast/" + collectionId)

    })()

})



module.exports = router