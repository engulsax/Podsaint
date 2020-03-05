const express = require('express')
const router = express.Router()

module.exports = function ({ categoryBL, podcastBL }) {

    router.use(async function(request, response, next){
        response.model = {
            categories: await categoryBL.getCategoriesDetails(),
            loggedIn: (request.session.key)
        }
        next()
    })

    router.get('/all', async function (request, response){

        const value = request.query.amount

        const model = response.model
        const reviews = await podcastBL.getNReviewsByUser(model.loggedIn.user, value)
        model.reviews = reviews.result
        model.amount = reviews.amount
                
        response.render("all-reviews.hbs", { model })
    })


    router.get('/edit-review/:id', function(request,response){

        const reviewId = request.params.id

        if (request.session.key) {

            (async function () {

                const model = response.model
                model.review = await podcastBL.getReviewById(reviewId)
                response.render("editreview.hbs",{ model })

            })()
        } else {
            response.render("signin.hbs")
        }
    })

    router.post('/edit-review/:id', function (request, response) {
        
        const reviewId = request.params.id
        const reviewText = request.body.reviewText
       
        if (request.session.key) {
            (async function () {
                await podcastBL.updateReviewById(reviewId,reviewText)
                response.redirect('/home') // change this ?
            })()
        } else {
            response.render("signin.hbs")
        }
    })

    router.post('/delete-review/:id', function(request,response){
        (async function () {

            const reviewId = request.params.id
            if (request.session.key) {

                await podcastBL.deleteReviewById(reviewId)
                response.redirect('/home') //change this ?
            }else{
                response.render("signin.hbs")
            }
        })()
    })

    return router

}
