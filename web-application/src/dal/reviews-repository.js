
const mySql = require("mysql")

const database = mySql.createConnection({
	host: "database",
	user: "root",
	password: "theRootPassword",
	database: "webAppDatabase"
})





exports.newPodcastReview = async function newPodcastReview(collectionId,humorRating,factRating,productionQualty,overallRating,reviewTest,seriousnessRating){

	const userId = 1
	const query = "INSERT INTO reviews (user_id, pod_id, production_quality_rating, seriousness_rating, humor_rating, fact_rating, overall_rating, review_text) VALUES(?, ?, ?, ?, ?, ?, ?, ?)"
	const values = [userId,collectionId,productionQualty,seriousnessRating,humorRating,factRating,overallRating,reviewTest]
	
	console.log("kommit hit reviews-repository")
	
	try {
		const podcast =  await this.getPodcastById(collectionId)
		
		console.log("------------------------podcast----------------")
		console.log(podcast)
		if(podcast===undefined){
			console.log("ska inte komma hit ska inte komma hit")
			await this.addPodcast(collectionId)
		}

	}catch {
		console.log("Database error")
		//throw error
	}
	
	
	await database.query(query,values, function(error,result){
		
		if(error){
			console.log(error)
			throw error
		}
		return result
	})
	
}

exports.getPodcastById = async function getPodcastById(collectionId){

	console.log("kommit hit get podcastbyid")

	const query = "SELECT * FROM podcasts WHERE pod_id = ?"
	const values = [collectionId]
	database.query(query,values, async function(error, result){
		
		if(error){
			console.log("EROOROROOROROR")
			console.log(error)
			throw error
		}else{
			console.log("---------------------result-------------")
			console.log(result)
			console.log(result[0].pod_id)
			return result[0].pod_id
		}
		
		
	})

}
exports.addPodcast = async function addPodcast(collectionId){
	console.log("Kommit hit add podcast")
	const query = "INSERT INTO podcasts(pod_id) VALUES(?)"
	const values = [collectionId]

	database.query(query, values, function(error, result){
		if(error){
			throw error
		}
		console.log(result)
	})
}
/*
CREATE TABLE reviews (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    pod_id VARCHAR(50),
    production_quality_rating INT,
    seriousness_rating INT,
    humor_rating INT,
    fact_rating INT,
    overall_rating INT,
    review_text VARCHAR(50),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_podcast FOREIGN KEY (pod_id) REFERENCES podcasts(pod_id) ON DELETE CASCADE

);*/


//module.exports = dataBase