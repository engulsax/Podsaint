const mySql = require("mysql")

const conn = mySql.createConnection({
	host: "database",
	user: "root",
	password: "theRootPassword",
	database: "webAppDatabase"
})

module.exports = conn