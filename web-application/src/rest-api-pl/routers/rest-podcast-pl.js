const express = require('express')
const router = express.Router()

module.exports = function ({ categoryBL, searchItunesBL, podcastBL, playlistBL }) {

    router.use(async function (request, response, next) {

        response.model = {
            categories: await categoryBL.getCategoriesDetails(),
            loggedIn: (request.session.key),
        }
        next()
    })

    router.use('/:id', async function (request, response, next) {
        const collectionId = request.params.id
        try {

            const informationRespons = await searchItunesBL.searchPodcast(collectionId)
            const information = informationRespons.results

            //REDO SEE OTHER
            if (response.model.loggedIn) {
                response.model.user = request.session.key.user
            } else {
                response.model.user = undefined
            }

            response.model.collectionId = collectionId,
                response.model.information = information,
                response.model.description = await podcastBL.fetchPodInfo(information[0].collectionViewUrl)

            next()

        } catch (error) {
            if (error.message == errors.errors.PODCAST_FETCH_ERROR) {
                //MAKE ERROR PAGE!!!
                response.status(404).end()
            } else {
                response.status(500).end()
            }
        }
    })

    router.get('/:id', function (request, response) {

        (async function () {

            const mainCategoryId = response.model.information[0].genreIds[0]
            const podcastsInSameCategory = await searchItunesBL.searchPodcastsWithId(mainCategoryId)
            const reviews = await podcastBL.getThreeReviewsByPodcastId(response.model.collectionId)
            const ratingInformation = await podcastBL.getRatingInformationByPodcastId(response.model.collectionId)

            const model = response.model
            model.tone = ratingInformation.tone
            model.average = ratingInformation.average
            model.reviews = reviews
            model.podcastsInSameCategory = podcastsInSameCategory.results


            if (model.loggedIn) {
                const userPlaylists = await playlistBL.getAllPlaylistsByUser(model.loggedIn.user)
                model.userPlaylists = userPlaylists
            }

            for (review of reviews) {
                if (review.review_poster === response.model.user) {
                    review.myReview = true
                }
            }

            response.status(200).json(model)

        })()
    })

    router.get('/:id/write-review', function (request, response) {

        if (request.session.key) {
            (async function () {
                const model = response.model
                response.status(200).json(model)
            })()
        } else {
            response.status(400).end()
        }
    })


    //Add 404 handling 
    router.get('/:id/all-reviews', async function (request, response) {

        const value = request.query.amount

        const model = response.model
        const reviews = await podcastBL.getNReviewsByPodcastId(response.model.collectionId, value)
        model.reviews = reviews.result
        model.amount = reviews.amount

        response.status(200).json(model)

    })


    router.post('/:id/write-review', function (request, response, next) {

        if (request.session.key) {
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
                    overallRating, reviewText
                )

                if (errors) {
                    const model = response.model
                    model.text = reviewText
                    model.errors = errors
                    console.log(model)
                    response.status(200).json(model)
                } else {
                    response.status(400).end()
                }
            })()
        } else {
            response.status(400).end()
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
                await playlistBL.addPodcastToPlaylist(collectionId, playlist, model.loggedIn.user, podcastInfo.collectionName, podcastInfo.artistName)
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
