
const conn = require("./db")
const util = require('util')


const db = util.promisify(conn.query).bind(conn)

exports.newPodcastReview = async function newPodcastReview(collectionId,comedyRating,factRating,productionQualty,overallRating,reviewText,seriousnessRating){
	
	const userId = 1
	const query = "INSERT INTO reviews (user_id, pod_id, production_quality_rating, seriousness_rating, comedy_rating, fact_rating, overall_rating, review_text) VALUES(?, ?, ?, ?, ?, ?, ?, ?)"
	const values = [userId,collectionId,productionQualty,seriousnessRating,comedyRating,factRating,overallRating,reviewText]
	
	try {
		
		const podcast =  await this.getPodcastById(collectionId)
		
		if(podcast == undefined){

			await this.addPodcast(collectionId)
		}

	}catch {
		console.log("Database error")
		//throw error
	}
	try{
		return await db(query, values)

	}catch(error){
		console.log(error)
		console.log("error when write new review in db")
	}
	
}

exports.getPodcastById = async function getPodcastById(collectionId){


	const query = "SELECT * FROM podcasts WHERE pod_id = ?"
	const values = [collectionId]

	try{
		const response = await db(query,values)
		console.log(response)
		return response[0].pod_id

	}catch(error){
		console.log(error)
		console.log("error in getPodcastById")
	}
}
exports.addPodcast = async function addPodcast(collectionId){
	
	const query = "INSERT INTO podcasts(pod_id) VALUES(?)"
	const values = [collectionId]
	try{
		const response = await db(query,values)
		return response
	}catch(error){
		console.log("error in addPodcast")
		console.log(error)
	}
}

exports.getAllReviewsByPodcastId = async function getAllReviewsByPodcastId(collectionId){
	
	const query = "SELECT * FROM reviews WHERE pod_id = ?"
	const values = [collectionId]

	try{
		const response = await db(query,values)
		return response
	}catch(error){
		console.log("error in getallreviewsbypodcast")
		console.log(error)
	}
}

exports.getAllReviewsByUser = async function getAllReviewsByUser(userId){

	const query = "SELECT * FROM reviews WHERE user_id = ?"
	const values = [userId]

	try{
		const response = await db(query,values)
		return response

	}catch(error){
		console.log("error in getallreviewsbyid")
		console.log(error)
	}
}
