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


            model = {
                reviews: reviews,
                categories: await categoryBL.getCategoriesDetails(),
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

            if (request.session.key) {

                const collectionId = request.params.id
                const informationRespons = await searchBL.searchPodcast(collectionId)
                const information = informationRespons.results
                const mainCategoryId = information[0].genreIds[0]
                const podcastsInSameCategory = await searchBL.searchPodcastsWithId(mainCategoryId)
                const description = await categoryBL.fetchPodInfo(information[0].collectionViewUrl)

                model = {
                    categories: await categoryBL.getCategoriesDetails(),
                    collectionId: collectionId,
                    information: information,
                    podcastsInSameCategory: podcastsInSameCategory.results,
                    description: description
                }
                response.render("write-review.hbs", { model })
            } else {
                response.render("signin.hbs")
            }
        })()
    })



    router.post('/:id/write-review', function (request, response) {

        (async function () {
            if (request.session.key) {
                const collectionId = request.params.id
                const comedyRating = parseInt(request.body.comedyRating)
                const factRating = parseInt(request.body.factRating)
                const productionQualty = parseInt(request.body.productionQuality)
                const overallRating = parseInt(request.body.overallRating)
                const reviewText = request.body.reviewText
                const seriousnessRating = parseInt(request.body.seriousnessRating)

                await podcastBL.newPodcastReview(collectionId, comedyRating, factRating, productionQualty, overallRating, reviewText, seriousnessRating)
                const information = await searchBL.searchPodcast(collectionId)
                const categories = await categoryBL.getCategoriesDetails()

                model = {
                    collectionId: collectionId,
                    information: information.results,
                    categories: categories
                }
                response.render("podcast.hbs", { model })
            } else {
                response.render("signin.hbs")
            }

        })()

    })
    return router
}
