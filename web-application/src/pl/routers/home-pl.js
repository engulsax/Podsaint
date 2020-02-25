const express = require('express')
const router = express.Router()

module.exports = function ({ categoryBL, accountBL, searchItunesBL, playlistBL }) {

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

            const model = response.model
            if (model.loggedIn) {
                
                const playlists = await playlistBL.getAllPlaylistsAndPodcastsByUser(model.loggedIn.user)   
                model.playlists = playlists
                response.render("feed.hbs", { model })
            }
            else {
                const mainPodcasts = await searchItunesBL.searchPodcasts('podcast')
                model.mainPodcasts = mainPodcasts.results
                response.render("home.hbs", { model })
            }
        })()
    })

    router.get('/:id/edit', function(request,response){
        (async function () {
            
            const model = response.model
            if (model.loggedIn) {
                const playlist = await playlistBL.getAllPodcastsByPlaylist(model.loggedIn.user, request.params.id) 
                console.log("playlists----")
                console.log(playlist)
                model.playlist = playlist
                response.render("editplaylist.hbs", { model })
            }else{
                response.render("signin.hbs")
            }
        })()
    })

    router.post('/:id/remove-playlist', function(request,response){
        console.log("härhärhär")
        const model = response.model
        if(model.loggedIn){
            (async function () {
                await playlistBL.removePlaylist(request.params.id, model.loggedIn.user)
                response.redirect("/home")
            })()
        }else{
            response.render("signin.hbs")
        }
    })
    router.post('/:id/remove-podcasts', function (request, response) {

        const playlist = request.params.id
        const model = response.model
        const podcastsToRemove  = request.body.pod_id
        const user = model.loggedIn.user
        
        if(model.loggedIn){
            (async function () {
                await playlistBL.removePodcastsFromPlaylist(podcastsToRemove, playlist,user )
                const playlists = await playlistBL.getAllPlaylistsAndPodcastsByUser(model.loggedIn.user)   
                model.playlists = playlists
                response.render("feed.hbs", {model})
            })()
        }else{
            response.render("signin.hbs")
        }
    })

    router.get('/account-settings', function(request, response) {
        const model = response.model
        if(model.loggedIn){
            response.render("account-settings.hbs", { model } )  
        }else{
            response.render("signup.hbs")
        }
    })

    router.post('/account-settings/update-passsword', function (request, response) {
        
        const model = response.model
       
        if (model.loggedIn) {
            (async function () {
              
                const newPassword = request.body.newPassword
                const confirmedPassword = request.body.confimPassword
         
                try {
                    await accountBL.updatePassword(model.loggedIn.user,newPassword,confirmedPassword)
                    response.redirect('/home')
                } catch(error){
                    console.log("----error")
                    console.log(error)
                    const model = response.model
                    model.inputError = error
                    response.render("account-settings.hbs",model)
                }
            })()

        } else {
            response.render("signup.hbs")
        }
    })

    router.post('/account-settings/update-email', function (request, response) {
        
        const model = response.model
        const newEmail = request.body.newEmail
        const confirmedEmail = request.body.confirmEmail

        if (model.loggedIn) {

            (async function () {

                try {
                    await accountBL.updateEmail(model.loggedIn.user,newEmail,confirmedEmail)
                    response.redirect('/home')

                } catch(error) {

                    const model = response.model
                    model.inputError = error
                    console.log(model)
                    response.render("account-settings.hbs", model)
                }
            })()

        } else {
            response.render("signup.hbs")
        }
    })

    router.post('/account-settings/delete-account', function(request, response) {
       
        const model = response.model

        if(model.loggedIn){
            
            (async function () {
                await accountBL.deleteAccount(model.loggedIn.user)
                request.session.destroy(function (){
                    response.redirect('/')
                })
            })()

        }else{
            response.render("signup.hbs")
        }      
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
