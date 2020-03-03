
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
                
        response.status(200).json(model)
    })

    return router

}