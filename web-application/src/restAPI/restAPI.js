
const cookieParser = require('cookie-parser')
//const csrf = require('csurf')
const express = require('express')
const bodyParser = require('body-parser')
const redis = require('redis')
const session = require('express-session')

const util = require('util')
const jwt = require('jsonwebtoken')
const jwtVerify = util.promisify(jwt.verify)
const jwtSign = util.promisify(jwt.sign)

const container = require('../main.js')
const accountBL = container.resolve('accountBL')
const searchItunesBL = container.resolve('searchItunesBL')
const podcastBL = container.resolve('podcastBL')
const playlistBL = container.resolve('playlistBL')


const err = require('../errors/error')

const serverSecret = "SGR#¤%2S2343OGj32r23//&#¤43rnj!#"
const app = express()

const cors = require('cors')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//app.use(cookieParser())

//app.use(csrf({ cookie: true }))

app.use( cors(), async function (request, response, next) {

  response.setHeader("Access-Control-Allow-Origin", "*")
  response.setHeader("Access-Control-Allow-Methods", "*")
  response.setHeader("Access-Control-Allow-Headers", "*")
  response.setHeader("Access-Control-Expose-Headers", "*")
 
  const authorizationHeader = request.get('Authorization')

  console.log(JSON.stringify("HEgewgwfgsfafwer----" + authorizationHeader))

  if (authorizationHeader != undefined) {
    const token = authorizationHeader.substr("Bearer ".length)
    response.token = token
  }

  next()

})


app.post('/signup', async function (request, response, next) {

  const username = request.body.username
  const password = request.body.password
  const email = request.body.email

  try {
    await accountBL.userRegistration(username, password, email)
    response.status(201).end()
  } catch (error) {
    console.log(error)
    next(error)
  }

})

app.post('/signin', async function (request, response, next) {

  const grantType = request.body.grant_type
  const username = request.body.username
  const password = request.body.password

  if (grantType != "password") {
    next(err.err.UNSUPPORTED_GRANT_TYPE)
    return
  }

  try {

    if (await accountBL.userLogin(username, password)) {

      const token = await jwtSign({ user: username }, serverSecret)


      response.status(200).json(token)

    }

  } catch (error) {
    console.log(error)

    if (
      error == "invalid_request" ||
      error == "invalid_scope"
    ) {

      error = err.err.BAD_REQUEST
      next(error)
      return

    }

    else if (
      error == "unauthorized_client" ||
      error == "invalid_client" ||
      error == "invalid_grant"

    ) {
      error = err.err.AUTH_USER_ERROR
      next(error)
      return
    }
    else if (error == err.err.LOGIN_ERROR) {
      next(error)
      return
    }

    error = err.err.INTERNAL_SERVER_ERROR
    next(error)
  }

})

app.get('/userplaylists', async function (request, response, next) {

  const token = response.token

  console.log(JSON.stringify(token))

  try {
    const authData = await jwtVerify(token, serverSecret)
    const userPlaylists = await playlistBL.getAllPlaylistsAndPodcastsByUser(authData)

    const playlists = []

    for (userPlaylist of userPlaylists) {

      playlist = {}

      const podcasts = []
      for (podcast of userPlaylist.podcastInfo) {

        pod = {}

        pod.collectionId = podcast.collectionId
        pod.imageUrl = podcast.artworkUrl600

        podcasts.push(pod)

      }

      playlist.playlistName = userPlaylist.playlistName

      playlist.podcasts = podcasts

      playlists.push(playlist)
    }

    response.status(200).json(playlists)
  } catch (error) {
    console.log(error)
    next(error)
  }

})

app.get('/podcast/:id', async function (request, response, next) {

  const collectionId = request.params.id

  try {

    model = {}

    const res = await searchItunesBL.searchPodcast(collectionId)
    const information = res.results
    model.posterUrl = information[0].artworkUrl600
    model.artistName = information[0].artistName
    model.collectionName = information[0].collectionName
    model.collectionId = collectionId

    infoUrl = information[0].collectionViewUrl
    model.description = await podcastBL.fetchPodInfo(infoUrl)

    response.status(200).json(model)

  } catch (error) {
    console.log(error)
    next(error)
  }

})

//MAKE MODEL ONLY USE NECESSARY STUFF
app.get('/search', async function (request, response, next) {

  const searchTerm = request.query.term

  try {

    const res = await searchItunesBL.searchPodcasts(searchTerm)
    const podcasts = res.results

    const model = []
    for (podcast of podcasts) {

      console.log(podcast)

      const podModel = {}

      podModel.collectionId = podcast.collectionId
      podModel.imageUrl = podcast.artworkUrl600

      model.push(podModel)
    }

    response.status(200).json(model)

  } catch (error) {
    console.log(error)
    next(error)
  }
})

app.use(function (request, response, next) {

  const error = err.err.NOT_FOUND_ERROR
  response.status(404).json(error)

})

app.use(function (error, request, response, next) {

  console.log(error)

  if (err.errorNotExist(error)) {
    error = err.err.INTERNAL_SERVER_ERROR
  }

  const code = err.getErrCode(error)

  response.status(code).json(error)

})


/*app.listen(8085, function () {
  console.log("Web application listening on port 8080.")
})
*/



/*


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

    router.post('/:id/remove-podcasts', async function (request, response, next) {
        
        const playlistId = request.params.id
        console.log("PLAYLISTNAME->   ")
        const model = response.model
        const podcastsToRemove = request.body.pod_id

        try {          
            await playlistBL.removePodcastsFromPlaylist(podcastsToRemove, playlistId, request.session.key.user, request.session.key)
            response.redirect(`/${playlistId}/edit`)        

        } catch (error) {
            

            console.log(error)
            next(error)
        }
    })

*/

module.exports = app