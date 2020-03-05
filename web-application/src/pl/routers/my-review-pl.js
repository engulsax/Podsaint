const express = require('express')
const err = require('../../errors/error')
const router = express.Router()

module.exports = function ({ categoryBL, podcastBL }) {

    router.use(async function (request, response, next) {
        response.model = {
            categories: await categoryBL.getCategoriesDetails(),
            loggedIn: (request.session.key)
        }
        next()
    })

    router.get('/all', async function (request, response) {

        const value = request.query.amount
        const model = response.model
        try {
            const reviews = await podcastBL.getNReviewsByUser(model.loggedIn.user, value)
            model.reviews = reviews.result
            model.amount = reviews.amount

            response.render("all-reviews.hbs", { model })
        } catch (error) {
            console.log(error)
            next(error)
        }
    })


    router.get('/edit-review/:id', async function (request, response) {

        const reviewId = request.params.id

        try {

            const model = response.model
            model.review = await podcastBL.getReviewById(reviewId)
            response.render("editreview.hbs", { model })

        } catch (error) {
            console.log(error)
            next(error)
        }
    })

    router.post('/edit-review/:id', async function (request, response) {

        const backURL = request.header('Referer') || '/'

        const reviewId = request.params.id
        const reviewText = request.body.reviewText

        try {
            await podcastBL.updateReviewById(reviewId, reviewText)
            response.redirect(backURL)
        } catch (error) {
            console.log(error)
            next(error)
        }

    })

    router.post('/delete-review/:id', async function (request, response) {

        const reviewId = request.params.id
        try {
            await podcastBL.deleteReviewById(reviewId)
        } catch (error) {
            console.log(error)
            next(error)
        }
    })

    return router

}
