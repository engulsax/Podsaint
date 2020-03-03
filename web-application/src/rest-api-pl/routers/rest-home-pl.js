const express = require('express')
const router = express.Router()

module.exports = function ({ categoryBL, accountBL, searchItunesBL, playlistBL, podcastBL, errors }) {

    router.use(async function (request, response, next) {
        response.model = {
            categories: await categoryBL.getCategoriesDetails(),
            loggedIn: (request.session.key)
        }
        next()
    })

    router.get('/', function (request, response) {
        response.redirect('/home')
    })


    //REDO
    router.get('/home', function (request, response) {
        (async function () {

            try {
                const model = response.model
                if (model.loggedIn) {
                    const playlists = await playlistBL.getAllPlaylistsAndPodcastsByUser(model.loggedIn.user)
                    const reviews = await podcastBL.getThreeReviewsByUser(model.loggedIn.user)

                    model.reviews = reviews
                    model.playlists = playlists

                    response.status(200).json(model)
                } else {
                    const mainPodcasts = await searchItunesBL.searchPodcasts('podcast')
                    model.mainPodcasts = mainPodcasts.results
                    response.status(200).json(model)
                }
            } catch (error) {
                next(new Error(errors.errors.INTERNAL_SERVER_ERROR))
            }
        })()
    })


    router.post('/:id/edit', function (request, response) {
        (async function () {
            const model = response.model
            if (model.loggedIn) {
                const playlist = await playlistBL.getAllPodcastsByPlaylist(model.loggedIn.user, request.params.id)
                model.playlist = playlist
                response.status(204).end()
            } else {
                //redirect('/unanthorized')
            }
        })()
    })

    router.delete('/:id/remove-playlist', function (request, response) {
        const model = response.model
        if (model.loggedIn) {
            (async function () {
                await playlistBL.removePlaylist(request.params.id, model.loggedIn.user)
                response.status(204).end()
            })()
        } else {
            response.status(400).end()
        }
    })

    router.delete('/:id/remove-podcasts', function (request, response) {

        const playlist = request.params.id
        const model = response.model
        const podcastsToRemove = request.body.pod_id
        const user = model.loggedIn.user

        if (model.loggedIn) {
            (async function () {
                await playlistBL.removePodcastsFromPlaylist(podcastsToRemove, playlist, user)
                const playlists = await playlistBL.getAllPlaylistsAndPodcastsByUser(model.loggedIn.user)
                model.playlists = playlists
                response.status(204).end()
            })()
        } else {
            response.status(400).end()
        }
    })

    router.get('/account-settings', function (request, response) {
        const model = response.model
        if (model.loggedIn) {
            response.status(204).end()
        } else {
            response.status(400).end()
        }
    })

    router.put('/account-settings/update-passsword', function (request, response) {

        const model = response.model

        if (model.loggedIn) {
            (async function () {

                const newPassword = request.body.newPassword
                const confirmedPassword = request.body.confimPassword

                try {
                    await accountBL.updatePassword(model.loggedIn.user, newPassword, confirmedPassword)
                    response.status(204).end()
                } catch (error) {
                    console.log(error)
                    response.status(500).end()
                }
            })()

        } else {
            response.status(400).end()
        }
    })

    router.put('/account-settings/update-email', function (request, response) {

        const model = response.model
        const newEmail = request.body.newEmail
        const confirmedEmail = request.body.confirmEmail

        if (model.loggedIn) {

            (async function () {

                try {
                    await accountBL.updateEmail(model.loggedIn.user, newEmail, confirmedEmail)
                    response.status(204).end()
                } catch (error) {
                    response.status(500).end()
                }
            })()

        } else {
            response.status(400).end()
        }
    })

    router.delete('/account-settings/delete-account', function (request, response) {

        const model = response.model

        if (model.loggedIn) {

            (async function () {
                await accountBL.deleteAccount(model.loggedIn.user)
                request.session.destroy(function () {
                    response.status(204).end()
                })
            })()

        } else {
            response.status(400).end()
        }
    })

    router.get('/signup', function (request, response) {
        const model = response.model
        response.status(200).json(model)
    })

    router.get('/signin', function (request, response) {
        const model = response.model
        response.status(200).json(model)
    })

    router.put('/signout', function (request, response) {

        if (response.model.loggedIn) {
            request.session.destroy(function () {
                response.status(204).end()
            })
        } else {
            response.status(400).end()
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
                response.status(204).end()

            } catch (error) {
                response.status(404).end()
            }
        })()
    })

    router.put('/signin', function (request, response) {
        (async function () {

            const username = request.body.username
            const password = request.body.passwords

            try {
                if (await accountBL.userLogin(username, password)) {
                    request.session.key = { user: username }
                    response.status(204).end()
                }
            } catch (error) {
                response.status(400).end()
            }
        })()
    })

    return router
}