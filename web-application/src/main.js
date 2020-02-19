const awilix = require('awilix')


const categoryPLRo = require('./pl/routers/category-pl')
const searchPLRo = require('./pl/routers/search-pl')
const homePLRo = require('./pl/routers/home-pl')
const podcastPLRo = require('./pl/routers/podcast-pl')


const accountDALFun = require('../src/dal/account-dal.js')
const categoryDALFun = require('../src/dal/category-dal.js')
const searchDALFun = require('../src/dal/search-dal')
const podcastDALFun = require('../src/dal/podcast-dal')


const categoryBLFun = require('../src/bl/category-bl')
const searchBLFun = require('../src/bl/search-bl')
const accountBLFun = require('../src/bl/account-bl')
const podcastBLFun = require('../src/bl/podcast-bl')

const container = awilix.createContainer()

container.register('homePL', awilix.asFunction(homePLRo))
container.register('categoryPL', awilix.asFunction(categoryPLRo))
container.register('searchPL', awilix.asFunction(searchPLRo))
container.register('podcastPL', awilix.asFunction(podcastPLRo))

container.register('accountBL', awilix.asFunction(accountBLFun))
container.register('categoryBL', awilix.asFunction(categoryBLFun))
container.register('searchBL', awilix.asFunction(searchBLFun))
container.register('podcastBL', awilix.asFunction(podcastBLFun))

container.register('accountDAL', awilix.asFunction(accountDALFun))
container.register('categoryDAL', awilix.asFunction(categoryDALFun))
container.register('searchDAL', awilix.asFunction(searchDALFun))
container.register('podcastDAL', awilix.asFunction(podcastDALFun))


/*const categoryPL = container.resolve('categoryPL')
/*const searchPL = container.resolve('searchPL')
const homePL = container.resolve('homePL')
const podcastPL = container.resolve('podcastPL')
*/

module.exports = container
