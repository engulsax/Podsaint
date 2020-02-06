
const mySql = require("mysql")

const dataBase = mySql.createConnection({
	host: "database",
	user: "root",
	password: "theRootPassword",
	database: "webAppDatabase"
})



