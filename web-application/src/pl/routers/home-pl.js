const express = require('express')
const categoryBL = require('../../bl/category-bl')
const searchBL = require('../../bl/search-bl')
const accountBL = require('../../bl/account-bl')
const router = express.Router()

/*NOT LOGGED IN*/
router.get('/', function (request, response) {
    (async function () {
        
        if(request.session.key){
            console.log("härhärähäräsdfäasädfäsadf")
            model = {categories: await categoryBL.getCategoriesDetails()}
            response.render("feed.hbs", { model })
        }
        else{
            const mainPodcasts = await searchBL.searchPodcasts('podcast')

            model = {
                categories: await categoryBL.getCategoriesDetails(),
                mainPodcasts: mainPodcasts.results
            }
            response.render("home.hbs", { model })
        }
    })()
})

/*LOGGED IN*/
router.get('/home', function (request, response) {
    (async function () {
        if(request.session.key){
            model = {categories: await categoryBL.getCategoriesDetails()}
            response.render("feed.hbs", { model })
        }
        else{
            const mainPodcasts = await searchBL.searchPodcasts('podcast')

            model = {
                categories: await categoryBL.getCategoriesDetails(),
                mainPodcasts: mainPodcasts.results
            }
            response.render("signup.hbs", { model })
        }        
    })()
})

router.get('/signup', function(request, response){
    response.render("signup.hbs")

})
router.get('/signin', function(request, response){
    response.render("signin.hbs")
})

router.post('/signout', function(request,response){

    if(request.session.key){
        request.session.destroy(function(){
              response.redirect('/')
        })
    }else{
        response.render("home.hbs")
    }
})

router.post('/signup', function(request, response){
    
    (async function () {
        console.log("signup post")
        const username = request.body.username
        const password = request.body.password
        const email = request.body.email
        
        try{
            await accountBL.userRegistration(username, password, email)
            model = {userRegSucess: true}
            response.render("home.hbs", model)

        }catch(error){ 
            model = {inputError: error}
            response.render("signup.hbs", model)    
        }
    })()
})

router.post('/signin', function(request, response){
    
    (async function () {

        const username = request.body.username
        const password = request.body.password
        
        try{
            if(await accountBL.userLogin(username, password)){
                request.session.key = {user:username}
                model = {categories: await categoryBL.getCategoriesDetails()} 
                response.render("feed.hbs", {model})

            }else{
                response.render("signin.hbs")
            }

        }catch(error){
            model = {inputError: error}
            response.render("signin.hbs",model)
        }
    })()
})

module.exports = router