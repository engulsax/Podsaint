const express = require('express')
const router = express.Router()

module.exports = function ({ categoryBL, searchItunesBL, podcastBL, playlistBL }) {

    router.use(async function (request, response, next) {

        response.model = {
            categories: await categoryBL.getCategoriesDetails(),
            loggedIn: (request.session.key)
        }
        next()
    })

    router.use('/:id', async function (request,response, next) {
        
        const collectionId = request.params.id
        const informationRespons = await searchItunesBL.searchPodcast(collectionId)
        const information = informationRespons.results

        response.model.collectionId = collectionId,
        response.model.information = information,
        response.model.description =  await podcastBL.fetchPodInfo(information[0].collectionViewUrl)

        next()

    })

    router.get('/:id', function (request, response) {

        (async function () {

            const model = response.model
            
            if(model.loggedIn){
                const userPlaylists = await playlistBL.getAllPlaylistsByUser(model.loggedIn.user)
                model.userPlaylists = userPlaylists
            }
            
            const mainCategoryId = response.model.information[0].genreIds[0]
            const podcastsInSameCategory = await searchItunesBL.searchPodcastsWithId(mainCategoryId)
            const reviews = await podcastBL.getAllReviewsByPodcastId(response.model.collectionId)
            const ratingInformation = await podcastBL.getRatingInformationByPodcastId(response.model.collectionId)
            
            
            model.tone = ratingInformation.tone
            model.average = ratingInformation.average
            model.reviews = reviews
            model.podcastsInSameCategory = podcastsInSameCategory.results

            response.render("podcast.hbs", { model })
        })()
    })

    router.get('/:id/write-review', function (request, response) {

        if (request.session.key) {

            (async function () {
                const model = response.model
                response.render("write-review.hbs", { model })
            })()
        } else {
            response.render("signin.hbs")
        }
    })

    router.post('/:id/write-review', function (request, response, next){
        //TAKE CARE OF ERROR HANDLING
        next()
    })

    router.post('/:id/write-review', function (request, response) {

        if (request.session.key) {
            (async function () {

                const collectionId = request.params.id
                const collectionName = request.body.collectionName
                const podCreator = request.body.artistName
                const toneRating = request.body.podcastTone
                const topicRelevenceRating = parseInt(request.body.topicRelevenceRating)
                const productionQualty = parseInt(request.body.productionQuality)
                const overallRating = parseInt(request.body.overallRating)
                const reviewText = request.body.reviewText
                const reviewPoster = request.session.key.user

                await podcastBL.newPodcastReview(
                    collectionId, reviewPoster, podCreator, collectionName, toneRating, topicRelevenceRating, productionQualty,
                    overallRating, reviewText
                )
                response.redirect("/podcast/" + collectionId)

            })()
        } else {
            response.render("signin.hbs")
        }
    })

    router.post('/:id/create-list', function (request, response){
        
        if(request.session.key){
            (async function (){
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

    router.post('/:id/add-to-playlist', function (request, response){
        
        const model = response.model

        if(model.loggedIn){
            (async function(){
                const podcastInfo = model.information[0]
                const collectionId = request.params.id
                const playlist = request.body.playlist
                await playlistBL.addPodcastToPlaylist(collectionId, playlist, model.loggedIn.user, podcastInfo.collectionName, podcastInfo.artistName)
                response.redirect("/podcast/" + collectionId)
            })()

        }else{
            response.render("signin.hbs")
        }
    })

    router.get('/:id/add-to-playlist', function (request, response){
        
        const model = response.model
        
        if(model.loggedIn){

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

        }else{
            response.render("signin.hbs")
        }
    })
    

    return router
}
