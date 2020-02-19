const express = require('express')

module.exports = function ({ categoryBL, searchBL, podcastBL }) {

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
            const ratingInformation = await podcastBL.getRatingInformationByPodcastId(collectionId)

            const model = {
                categories: await categoryBL.getCategoriesDetails(),
                tone: ratingInformation.tone,
                average: ratingInformation.average,
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

        if (request.session.key) {

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
        } else {
            response.render("signin.hbs")
        }
    })



    router.post('/:id/write-review', function (request, response) {

        if (request.session.key) {
            (async function () {

                const collectionId = request.params.id
                const collectionName = request.body.collectionName
                const toneRating = parseInt(request.body.podcastTone)
                const topicRelevenceRating = parseInt(request.body.topicRelevenceRating)
                const productionQualty = parseInt(request.body.productionQuality)
                const overallRating = parseInt(request.body.overallRating)
                const reviewText = request.body.reviewText

                await podcastBL.newPodcastReview(
                    collectionId, collectionName, toneRating, topicRelevenceRating, productionQualty,
                    overallRating, reviewText
                )
                response.redirect("/podcast/" + collectionId)

            })()
        } else {
            response.render("signin.hbs")
        }

    })
    return router
}
