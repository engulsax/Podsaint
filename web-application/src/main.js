const awilix = require('awilix')

//const errors = require('./errors/error')

const categoryPLRouter = require('./pl/routers/category-pl')
const searchPLRouter = require('./pl/routers/search-pl')
const homePLRouter = require('./pl/routers/home-pl')
const podcastPLRouter = require('./pl/routers/podcast-pl')
const myReviewPLRouter = require('./pl/routers/my-review-pl')

const authBLFun = require('../src/bl/authenticate-bl')
const categoryBLFun = require('../src/bl/category-bl')
const searchItunesBLFun = require('./bl/search-itunes-bl')
const searchPodsaintBLFun = require('./bl/search-podsaint-bl')
const accountBLFun = require('../src/bl/account-bl')
const podcastBLFun = require('../src/bl/podcast-bl')
const playlistBLFun = require('../src/bl/playlist-bl')

const playlistDALFun = require('../src/dal/playlist-dal') 
const accountDALFun = require('../src/dal/account-dal')
const searchPodsaintDALFun = require('../src/dal/search-podsaint-dal')
const podcastDALFun = require('../src/dal/podcast-dal')

const container = awilix.createContainer()

//container.register('err', awilix.asFunction(errors))

container.register('homePL', awilix.asFunction(homePLRouter))
container.register('categoryPL', awilix.asFunction(categoryPLRouter))
container.register('searchPL', awilix.asFunction(searchPLRouter))
container.register('podcastPL', awilix.asFunction(podcastPLRouter))
container.register('myReviewPL', awilix.asFunction(myReviewPLRouter))

container.register('authBL', awilix.asFunction(authBLFun))
container.register('accountBL', awilix.asFunction(accountBLFun))
container.register('categoryBL', awilix.asFunction(categoryBLFun))
container.register('searchPodsaintBL', awilix.asFunction(searchPodsaintBLFun))
container.register('searchItunesBL', awilix.asFunction(searchItunesBLFun))
container.register('podcastBL', awilix.asFunction(podcastBLFun))

container.register('accountDAL', awilix.asFunction(accountDALFun))
container.register('searchPodsaintDAL', awilix.asFunction(searchPodsaintDALFun))
container.register('podcastDAL', awilix.asFunction(podcastDALFun))

container.register('playlistBL' , awilix.asFunction(playlistBLFun))
container.register('playlistDAL', awilix.asFunction(playlistDALFun))

module.exports = container
