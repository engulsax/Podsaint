const express = require('express')
const err = require('../../errors/error')
const router = express.Router()

module.exports = function ({ categoryBL, accountBL, searchItunesBL, playlistBL, podcastBL }) {

    router.get('/', function (request, response) {
        response.redirect('/home')
    })

    router.get('/home', async function (request, response, next) {
        const model = response.model
        try {
            const playlists = await playlistBL.getAllPlaylistsAndPodcastsByUser(request.session.key)
            const reviews = await podcastBL.getThreeReviewsByUser(request.session.key)

            model.reviews = reviews
            model.playlists = playlists

            response.render("feed.hbs", model )
        } catch (error) {
            console.log(error)
            if (error === err.err.AUTH_USER_ERROR) {
                const mainPodcasts = await searchItunesBL.searchPodcasts('podcast')
                model.mainPodcasts = mainPodcasts.results
                response.render("home.hbs", model )
            } else {
                next(error)
            }
        }
    })

    router.get('/:id/edit', async function (request, response, next) {
        const model = response.model
        try {
            const playlist = await playlistBL.getAllPodcastsByPlaylist(request.session.key.user, request.params.id, request.session.key)
            model.playlist = playlist
            response.render("editplaylist.hbs", model )
        } catch (error) {
            console.log(error)
            next(error)
        }
    })

    router.post('/:id/remove-playlist', async function (request, response, next) {
        try {
            await playlistBL.removePlaylist(request.params.id, request.session.key.user, request.session.key)
            response.redirect("/home")
        } catch (error) {
            next(error)
        }
    })

    router.post('/:id/remove-podcasts', function (request, response, next) {

        const playlistId = request.params.id
        const model = response.model
        const podcastsToRemove = request.body.pod_id

        try {
            (async function () {
                await playlistBL.removePodcastsFromPlaylist(podcastsToRemove, playlistId, request.session.key.user, request.session.key)
                response.redirect(`/:${playlistId}/edit`)
            })()
        } catch (error) {
            next(error)
        }
    })

    router.get('/account-settings', function (request, response, next) {
        const model = response.model
        if (request.session.key) {
            response.render("account-settings.hbs",  model )
        } else {
            next(err.err.AUTH_USER_ERROR)
        }
    })

    router.post('/account-settings/update-passsword', async function (request, response, next) {

        const model = response.model
        const newPassword = request.body.newPassword
        const confirmedPassword = request.body.confimPassword

        try {
            await accountBL.updatePassword(model.loggedIn.user, newPassword, confirmedPassword)
            response.redirect('/home')
        } catch (error) {
            console.log(error)
            if (err.errorNotExist(error)) {
                error = err.err.INTERNAL_SERVER_ERROR
                next(error)
                return
            }
            if (error === err.err.AUTH_USER_ERROR) {
                next(error)
                return
            }
            inputErrors = []
            model.inputErrors = inputErrors.concat(error)
            response.render("account-settings.hbs", model)
        }
    })

    router.post('/account-settings/update-email', async function (request, response, next) {

        const model = response.model
        const newEmail = request.body.newEmail
        const confirmedEmail = request.body.confirmEmail

        try {

            await accountBL.updateEmail(model.loggedIn.user, newEmail, confirmedEmail)
            response.redirect('/home')

        } catch (error) {
            console.log(error)
            if (err.errorNotExist(error)) {
                error = err.err.INTERNAL_SERVER_ERROR
                next(error)
                return
            }
            if (error == err.err.AUTH_USER_ERROR) {
                next(error)
                return
            }
            inputErrors = []
            model.inputErrors = inputErrors.concat(error)
            response.render("account-settings.hbs", model)
        }

    })

    router.post('/account-settings/delete-account', async function (request, response, next) {
        const model = response.model
        try {
            await accountBL.deleteAccount(model.loggedIn.user)
            request.session.destroy(function () {
                response.redirect('/')
            })
        } catch (error) {
            console.log(error)
            if (err.errorNotExist(error)) {
                error = err.err.INTERNAL_SERVER_ERROR
            }
            next(error)
        }
    })

    router.get('/signup', function (request, response) {
        const model = response.model
        response.render("signup.hbs",  model )
    })

    router.get('/signin', function (request, response) {
        const model = response.model
        response.render("signin.hbs",  model )
    })

    router.post('/signout', function (request, response) {

        if (request.session.key) {
            request.session.destroy(function () {
                response.redirect('/')
            })
        } else {
            response.redirect('/')
        }
    })

    router.post('/signup', async function (request, response, next) {

        const model = response.model
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
            console.log(error)
            if (err.errorNotExist(error)) {
                error = err.err.INTERNAL_SERVER_ERROR
                next(error)
                return
            }
            inputErrors = []
            model.inputErrors = inputErrors.concat(error)
            response.render("signup.hbs", model)
        }
    })

    router.post('/signin', async function (request, response, next) {

        const username = request.body.username
        const password = request.body.password
        const model = response.model

        try {
            if (await accountBL.userLogin(username, password)) {
                request.session.key = { user: username }
            }
            response.redirect('/')
        } catch (error) {
            console.log(error)
            next(error)
        }
    })

    return router
}
