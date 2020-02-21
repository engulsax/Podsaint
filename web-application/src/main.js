const awilix = require('awilix')


const categoryPLRo = require('./pl/routers/category-pl')
const searchPLRo = require('./pl/routers/search-pl')
const homePLRo = require('./pl/routers/home-pl')
const podcastPLRo = require('./pl/routers/podcast-pl')

const categoryBLFun = require('../src/bl/category-bl')
const searchItunesBLFun = require('./bl/search-itunes-bl')
const searchPodsaintBLFun = require('./bl/search-podsaint-bl')
const accountBLFun = require('../src/bl/account-bl')
const podcastBLFun = require('../src/bl/podcast-bl')

const accountDALFun = require('../src/dal/account-dal.js')
const searchPodsaintDALFun = require('../src/dal/search-podsaint-dal')
const podcastDALFun = require('../src/dal/podcast-dal')

const container = awilix.createContainer()

container.register('homePL', awilix.asFunction(homePLRo))
container.register('categoryPL', awilix.asFunction(categoryPLRo))
container.register('searchPL', awilix.asFunction(searchPLRo))
container.register('podcastPL', awilix.asFunction(podcastPLRo))

container.register('accountBL', awilix.asFunction(accountBLFun))
container.register('categoryBL', awilix.asFunction(categoryBLFun))
container.register('searchPodsaintBL', awilix.asFunction(searchPodsaintBLFun))
container.register('searchItunesBL', awilix.asFunction(searchItunesBLFun))
container.register('podcastBL', awilix.asFunction(podcastBLFun))

container.register('accountDAL', awilix.asFunction(accountDALFun))
container.register('searchPodsaintDAL', awilix.asFunction(searchPodsaintDALFun))
container.register('podcastDAL', awilix.asFunction(podcastDALFun))


/*const categoryPL = container.resolve('categoryPL')
/*const searchPL = container.resolve('searchPL')
const homePL = container.resolve('homePL')
const podcastPL = container.resolve('podcastPL')
*/

module.exports = container
