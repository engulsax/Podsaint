const express = require('express')
const err = require('../../errors/error')
const router = express.Router()

module.exports = function ({ categoryBL, searchItunesBL, podcastBL, playlistBL }) {

    router.use('/:id', async function (request, response, next) {
                
        const collectionId = request.params.id

        try {
            const informationRespons = await searchItunesBL.searchPodcast(collectionId)
            const information = informationRespons.results
            
            if(request.query.status == "podcast-added"){
                response.model.successMessage = "Podcast added to playlist"
            }
            if(request.query.status == "playlist-created"){
                response.model.successMessage = "New playlist created"
            }

            response.model.collectionId = collectionId
            response.model.information = informationF
            response.model.description = await podcastBL.fetchPodInfo(information[0].collectionViewUrl)
            next()

        } catch (error) {
            console.log(error)
            next(error)
        }
    })

    router.get('/:id', async function (request, response, next) {

        try {
        
            const userPlaylists = await playlistBL.getAllPlaylistsByUser(request.session.key)
            response.model.userPlaylists = userPlaylists
            next()

        } catch (error) {
            console.log(error)
            if (error == err.err.AUTH_USER_ERROR) {
                next()
                return
            } else {
                if (err.errorNotExist(error)) {
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                next(error)
            }
        }
    })

    router.get('/:id/', async function (request, response, next) {

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
            response.render("podcast.hbs", model )
        } catch (error) {
            console.log(error)
            next(error)
        }
    })

    router.get('/:id/write-review', function (request, response, next) {

        const model = response.model

        try {
            if (request.session.key) {
                response.render("write-review.hbs", model )
            } else {
                throw err.err.AUTH_USER_ERROR
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    })

    router.get('/:id/all-reviews', async function (request, response, next) {

        const value = request.query.amount
        const model = response.model

        try {
            const reviews = await podcastBL.getNReviewsByPodcastId(response.model.collectionId, value, request.session.key)
            model.reviews = reviews.result
            model.amount = reviews.amount

            response.render("all-reviews.hbs",  model )
        } catch (error) {
            console.log(error)
            next(error)
        }

    })

    router.post('/:id/write-review', async function (request, response, next) {

        const model = response.model

        const collectionId = request.params.id
        const collectionName = request.body.collectionName
        const podCreator = request.body.artistName
        const toneRating = request.body.podcastTone
        const topicRelevenceRating = parseInt(request.body.topicRelevenceRating) || 0
        const productionQualty = parseInt(request.body.productionQuality) || 0
        const overallRating = parseInt(request.body.overallRating) || 0
        const reviewText = request.body.reviewText
        const reviewPoster = request.session.key.user

        try {
            await podcastBL.newPodcastReview(
                collectionId, reviewPoster, podCreator, collectionName,
                toneRating, topicRelevenceRating, productionQualty,
                overallRating, reviewText, request.session.key
            )

            response.redirect("/podcast/" + collectionId)

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
            model.text = reviewText
            inputErrors = []
            model.inputErrors = inputErrors.concat(error)
            response.render("write-review.hbs",  model )
        }
    })

    router.post('/:id/create-list', async function (request, response, next) {
        
        const model = response.model
        const playlistName = request.body.playlistName
        const pod = response.model.information[0]
        const collectionId = request.params.id

        try {
            const userPlaylists = await playlistBL.getAllPlaylistsByUser(request.session.key)
            model.userPlaylists = userPlaylists

            await playlistBL.createPlaylist(playlistName,
                request.session.key.user, request.session.key,
                collectionId, pod.collectionName, pod.artistName)

            response.redirect("/podcast/" + collectionId + "?status=playlist-created")

        } catch (error) {

            if( error == err.err.DUP_PLAYLIST_ERROR || error == err.err.PLAYLIST_NAME_ERROR){
            
                inputErrors = []
                model.inputErrors = inputErrors.concat(error)
                response.render("add-to-playlist.hbs",  model )
                return
            }
            console.log(error)
            next(error)
        }
    })

    router.post('/:id/add-to-playlist', async function (request, response, next) {
    
        const model = response.model
       
        try {
            const podcastInfo = model.information[0]
            const collectionId = request.params.id
            const playlistId = request.body.playlist

            const userPlaylists = await playlistBL.getAllPlaylistsByUser(request.session.key)
            response.model.userPlaylists = userPlaylists
            
            await playlistBL.addPodcastToPlaylist(
                playlistId, collectionId,
                podcastInfo.collectionName,
                podcastInfo.artistName, request.session.key)

            response.redirect("/podcast/" + collectionId + "?status=podcast-added")

        } catch (error) {
            
            if(error == err.err.DUP_PODCAST_PLAYLIST_ERROR || error == err.err.PLAYLIST_ADD_ERROR){
                inputErrors = []
                model.inputErrors = inputErrors.concat(error)
                response.render("add-to-playlist.hbs",  model )
                return
            }
            console.log(error)
            next(error)
        }
    })

    router.get('/:id/add-to-playlist', async function (request, response) {

        const model = response.model

        try {
            
            const userPlaylists = await playlistBL.getAllPlaylistsByUser(response.model.loggedIn)
            model.userPlaylists = userPlaylists
            console.log(model.userPlaylists)
            response.render("add-to-playlist.hbs",  model )

        } catch (error) {
            console.log(error)
            next(error)
        }
    })

    return router
}
