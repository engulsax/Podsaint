const express = require('express')
const router = express.Router()

module.exports = function ({ categoryBL, searchItunesBL, podcastBL, playlistBL, errors }) {

    router.use(async function (request, response, next) {

        response.model = {
            categories: await categoryBL.getCategoriesDetails(),
            loggedIn: (request.session.key)
        }
        next()
    })

    router.use('/:id', async function (request, response, next) {

        const collectionId = request.params.id
        try {

            const informationRespons = await searchItunesBL.searchPodcast(collectionId)
            const information = informationRespons.results
            /*
                        //REDO SEE OTHER
                        if (response.model.loggedIn) {
                            response.model.user = request.session.key.user
                        } else {
                            response.model.user = undefined
                        }*/

            response.model.collectionId = collectionId
            response.model.information = information
            response.model.description = await podcastBL.fetchPodInfo(information[0].collectionViewUrl)

            next()

        } catch (error) {
            if (error.message == errors.errors.PODCAST_FETCH_ERROR) {
                //MAKE ERROR PAGE!!!
                response.redirect('/')
            } else {
                next(error)
            }
        }
    })

    router.get('/:id', async function (request, response, next) {

        try {

            const mainCategoryId = response.model.information[0].genreIds[0]
            const podcastsInSameCategory = await searchItunesBL.searchPodcastsWithId(mainCategoryId)
            const reviews = await podcastBL.getThreeReviewsByPodcastId(response.model.collectionId, request.session.key)
            const ratingInformation = await podcastBL.getRatingInformationByPodcastId(response.model.collectionId)

            const model = response.model
            model.tone = ratingInformation.tone
            model.average = ratingInformation.average
            model.reviews = reviews
            model.podcastsInSameCategory = podcastsInSameCategory.results

            const userPlaylists = await playlistBL.getAllPlaylistsByUser(request.session.key)
            model.userPlaylists = userPlaylists

            response.render("podcast.hbs", { model })
        } catch (error) {
            next(error)
        }
    })

    router.get('/:id/write-review', function (request, response, error) {

        try {
            if (request.session.key) {

                (async function () {
                    const model = response.model
                    response.render("write-review.hbs", { model })
                })()
            } else {
                response.render("signin.hbs")
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    })

    router.get('/:id/all-reviews', async function (request, response, next) {

        try {
            const value = request.query.amount

            const model = response.model
            const reviews = await podcastBL.getNReviewsByPodcastId(response.model.collectionId, value, request.session.key)
            model.reviews = reviews.result
            model.amount = reviews.amount

            response.render("all-reviews.hbs", { model })
        } catch (error) {
            console.log(error)
            next(error)
        }

    })


    router.post('/:id/write-review', function (request, response, next) {

        try {
            (async function () {

                const collectionId = request.params.id
                const collectionName = request.body.collectionName
                const podCreator = request.body.artistName
                const toneRating = request.body.podcastTone
                const topicRelevenceRating = parseInt(request.body.topicRelevenceRating) || 0
                const productionQualty = parseInt(request.body.productionQuality) || 0
                const overallRating = parseInt(request.body.overallRating) || 0
                const reviewText = request.body.reviewText
                const reviewPoster = request.session.key.user

                const errors = await podcastBL.newPodcastReview(
                    collectionId, reviewPoster, podCreator, collectionName,
                    toneRating, topicRelevenceRating, productionQualty,
                    overallRating, reviewText, request.session.key
                )

                if (errors) {
                    const model = response.model
                    model.text = reviewText
                    model.errors = errors
                    console.log(model)
                    response.render("write-review.hbs", { model })
                } else {
                    response.redirect("/podcast/" + collectionId)
                }
            })()
        } catch (error) {
            next(error)
        }
    }),

        router.post('/:id/create-list', function (request, response) {

            if (request.session.key) {
                (async function () {
                    const playlistName = request.body.playlistName
                    const model = response.model.information[0]
                    const collectionId = request.params.id
                    const loggedIn = request.session.key

                    await playlistBL.addPodcastToPlaylist(collectionId, playlistName, loggedIn.user, model.collectionName, model.artistName)
                    response.redirect("/podcast/" + collectionId)
                })()
            } else {
                response.render("signin.hbs")
            }
        })

    router.post('/:id/add-to-playlist', function (request, response) {

        const model = response.model

        if (model.loggedIn) {
            (async function () {
                const podcastInfo = model.information[0]
                const collectionId = request.params.id
                const playlist = request.body.playlist
                await playlistBL.addPodcastToPlaylist(collectionId, playlist, request.session.key.user, podcastInfo.collectionName, podcastInfo.artistName)
                response.redirect("/podcast/" + collectionId)
            })()
        } else {
            response.render("signin.hbs")
        }
    })

    router.get('/:id/add-to-playlist', function (request, response) {

        const model = response.model

        if (model.loggedIn) {

            (async function () {
                const userPlaylists = await playlistBL.getAllPlaylistsByUser(response.model.loggedIn.user)
                model.userPlaylists = userPlaylists
                response.render("add-to-playlist.hbs", { model })
            })()

            /*(async function(){
                const model = response.model.information[0]
                const collectionId = request.params.id
                const playlist = request.body.playlist
                await playlistBL.addPodcastToPlaylist(collectionId, playlist, response.model.loggedIn.user, model.collectionName, model.artistName)
                response.redirect("/podcast/" + collectionId)
            })()*/

        } else {
            response.render("signin.hbs")
        }
    })

    return router
}
