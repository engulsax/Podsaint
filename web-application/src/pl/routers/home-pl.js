const express = require('express')
const categoryBL = require('../../bl/category-bl')
const searchBL = require('../../bl/search-bl')
const accountBL = require('../../bl/account-bl')
const router = express.Router()

/*NOT LOGGED IN*/
router.get('/', function (request, response) {
    (async function () {
        
        const mainPodcasts = await searchBL.searchPodcasts('podcast')

        model = {
            categories: await categoryBL.getCategoriesDetails(),
            mainPodcasts: mainPodcasts.results
           
        }

        console.log(model.mainPodcasts)

        response.render("home.hbs", { model })
    })()
})

/*LOGGED IN*/
router.get('/home', function (request, response) {
    (async function () {
        model = {
            categories: await categoryBL.getCategoriesDetails()
        }
        response.render("feed.hbs", { model })
    })()
})

router.post('/signup', function(request, response){

    (async function () {
        
        const username = request.body.username
        const password= request.body.password
        
        await accountBL.userRegistration(username, password)
        response.render("home.hbs")

    })()
})

router.post('/signin', function (request, response) {
    (async function () {
       
        const username = request.body.username
        const password = request.body.password
        const validUser = await accountBL.userLogin(username, password)
        
        if (validUser){
            model = {categories: await categoryBL.getCategoriesDetails()}
            response.render("feed.hbs", {model})
        }else{
            //not logged in
            response.render("home.hbs")
        }
        
    })()
})

module.exports = router