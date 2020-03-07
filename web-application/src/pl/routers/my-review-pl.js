const express = require('express')
const err = require('../../errors/error')
const router = express.Router()

module.exports = function ({ categoryBL, podcastBL, searchItunesBL, playlistBL }) {

    router.use(async function (request, response, next) {
        response.model.categories = await categoryBL.getCategoriesDetails()
        next()
    })

    router.get('/all', async function (request, response, next) {

        const value = request.query.amount
        const model = response.model
        try {
            const reviews = await podcastBL.getNReviewsByUser(request.session.key, value)
            model.reviews = reviews.result
            model.amount = reviews.amount

            response.render("all-my-reviews.hbs", model)
        } catch (error) {
            console.log(error)
            next(error)
        }
    })


    router.get('/edit-review/:id', async function (request, response, next) {

        const reviewId = request.params.id
        const model = response.model

        try {

            const userPlaylists = await playlistBL.getAllPlaylistsByUser(request.session.key)
            model.userPlaylists = userPlaylists

            const review = await podcastBL.getReviewById(reviewId)
            model.review = review

            const informationRespons = await searchItunesBL.searchPodcast(review[0].pod_id)
            const information = informationRespons.results
            model.collectionId = review[0].pod_id
            model.information = information
            model.description = await podcastBL.fetchPodInfo(information[0].collectionViewUrl)

            response.render("editreview.hbs", model)

        } catch (error) {
            console.log(error)
            next(error)
        }
    })

    router.post('/edit-review/:id', async function (request, response, next) {

        const reviewId = request.params.id
        const reviewText = request.body.reviewText

        try {
            await podcastBL.updateReviewById(reviewId, reviewText, request.session.key)
            response.redirect('/')
        } catch (error) {
            console.log(error)
            next(error)
        }
    })

    router.post('/delete-review/:id', async function (request, response, next) {

        const reviewId = request.params.id
        try {
            await podcastBL.deleteReviewById(reviewId, request.session.key)
            response.redirect('back')
        } catch (error) {
            console.log(error)
            next(error)
        }
    })
    return router

}
