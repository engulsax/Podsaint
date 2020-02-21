const express = require('express')
const router = express.Router()

module.exports = function ({ categoryBL, accountBL, searchItunesBL }) {

    router.use(async function(request, response, next){
        response.model = {
            categories: await categoryBL.getCategoriesDetails(),
            loggedIn: (request.session.key)
        }
        next()
    })

    /*NOT LOGGED IN*/
    router.get('/', function (request, response) {
        response.redirect('/home')
    })

    /*LOGGED IN*/
    router.get('/home', function (request, response) {
        (async function () {
            if (response.model.loggedIn) {
                const model = response.model
                response.render("feed.hbs", { model })
            }
            else {
                const mainPodcasts = await searchItunesBL.searchPodcasts('podcast')
                const model = response.model
                model.mainPodcasts = mainPodcasts.results
                response.render("home.hbs", { model })
            }
            console.log(request.session.key.user)
        })()
    })

    router.get('/signup', function (request, response) {
            const model = response.model
            response.render("signup.hbs", { model })
    })

    router.get('/signin', function (request, response) {
            const model = response.model
            response.render("signin.hbs", { model })
    })

    router.post('/signout', function (request, response) {

        if (response.model.loggedIn) {
            request.session.destroy(function () {
                response.redirect('/')
            })
        } else {
            response.redirect('/')
        }
    })

    router.post('/signup', function (request, response) {
        (async function () {
            const username = request.body.username
            const password = request.body.password
            const email = request.body.email

            try {
                await accountBL.userRegistration(username, password, email)
                if (await accountBL.userLogin(username, password)) {
                    request.session.key = { user: username }
                }
                response.redirect('/')

            } catch (error) {
                const model = response.model
                model.inputError = error
                response.render("signup.hbs", model)
            }
        })()
    })

    router.post('/signin', function (request, response) {
        (async function () {

            const username = request.body.username
            const password = request.body.password

            try {
                if (await accountBL.userLogin(username, password)) {
                    request.session.key = { user: username }
                }
                response.redirect('/')
            } catch (error) {
                const model = response.model
                model.inputError = error
                response.render("signin.hbs", model)
            }
        })()
    })

    return router
}
