
const conn = require("./db")
const util = require('util')

const db = util.promisify(conn.query).bind(conn)
const ratingDatabaseNames = ["overall_rating", "production_quality_rating", "topic_relevence_rating", "comedy_rating", "drama_rating"]
const ratingsVaribleNames = ["overall", "quality", "topic", "comedy", "drama"]
const arrSum = arr => arr.reduce((a, b) => a + b, 0)

exports.newPodcastReview = async function newPodcastReview(collectionId, comedyRating, dramaRating, topicRelevence, productionQuality, overallRating, reviewText) {

	const userId = 1
	const query = "INSERT INTO reviews (user_id, pod_id, production_quality_rating, topic_relevence_rating, comedy_rating, drama_rating, overall_rating, review_text) VALUES(?, ?, ?, ?, ?, ?, ?, ?)"
	const values = [userId, collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating, reviewText]

	/*comdey_rating INT,
    drama_rating INT,
    topic_relevence_rating INT,
    production_quality_rating INT,
    overall_rating INT*/

	try {

		const podcast = await this.getPodcastById(collectionId)
		console.log("CHECK THIS MF OUT HAHA ---- " + podcast)

		if (podcast == undefined) {

			await this.addPodcast(collectionId)
		}

		await addNewInfoToPodcast(collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating)
		await db(query, values)

		return

	} catch (error) {
		console.log(error)
		console.log("error when write new review in db")
	}
}

async function addNewInfoToPodcast(collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating) {

	try {
		const ratings = await getRatingsFromPodcast(collectionId)

		ratings.overall += await overallRating
		ratings.quality += await productionQuality
		ratings.topic += await topicRelevence
		ratings.drama += await dramaRating
		ratings.comdey += await comedyRating

		/*Finding all value in objects with the help of ratingsVaribleNames'
		which has the name of all the keys aka the varible names (in this case)*/
		ratingDatabaseNames.forEach(async function (rating, i) {
			//await addNewRatingsToPodcast(collectionId, rating, ratings[ratingsVaribleNames[i]])
			console.log(rating+ "------" + "-------"  + ratings[ratingsVaribleNames[i]])
		})

	} catch (error) {
		console.log(error)
		//throw(error)
	}

	//console.log(await ratings)

}

async function addNewRatingsToPodcast(collectionId, ratingName, ratingScore) {
	query = "INSERT INTO (" + ratingName + ") Values (?) FROM podcast WHERE pod_id = ?"
	values = [ratingScore, collectionId]
	db(query, values)
}

async function getRatingsFromPodcast(collectionId) {

	values = [collectionId]

	overallQuery = "SELECT overall_rating FROM podcasts WHERE pod_id = ?"
	qualityQuery = "SELECT production_quality_rating FROM podcasts WHERE pod_id = ?"
	topicQuery = "SELECT topic_relevence_rating FROM podcasts WHERE pod_id = ?"
	comedyQuery = "SELECT comedy_rating FROM podcasts WHERE pod_id = ?"
	dramaQuery = "SELECT drama_rating FROM podcasts WHERE pod_id = ?"

	const ratings = {}

	/*PROBLEM IS HERE*/
	try {
		ratings.overall = await db(overallQuery, values)
		console.log("afsafea   " + Object.values(ratings.overall))
		ratings.quality = await db(qualityQuery, values)
		ratings.topic = await db(topicQuery, values)
		ratings.comdey = await db(comedyQuery, values)
		ratings.drama = await db(dramaQuery, values)
		console.log("GET RATINGS-------"+ratings)
		return ratings
	} catch (error) {
		console.log(error)
		return ratings
		//throw error
	}
}

exports.getPodcastById = async function getPodcastById(collectionId) {


	const query = "SELECT * FROM podcasts WHERE pod_id = ?"
	const values = [collectionId]

	try {
		const response = await db(query, values)
		//console.log(response)
		return response[0].pod_id

	} catch (error) {
		console.log(error)
		console.log("error in getPodcastById")
	}
}

exports.addPodcast = async function addPodcast(collectionId) {
	const query = "INSERT INTO podcasts(pod_id, pod_name, comedy_rating, drama_rating, topic_relevence_rating, production_quality_rating, overall_rating) VALUES(?, ?, ? ,? ,? ,? ,?)"
	const values = [collectionId, "poop", 0, 0, 0, 0, 0]

	try {
		const response = await db(query, values)
		return response
	} catch (error) {
		console.log("error in addPodcast")
		console.log(error)
	}
}

exports.getAllReviewsByPodcastId = async function getAllReviewsByPodcastId(collectionId) {

	const query = "SELECT * FROM reviews WHERE pod_id = ?"
	const values = [collectionId]

	try {
		const response = await db(query, values)
		return response
	} catch (error) {
		console.log("error in getallreviewsbypodcast")
		console.log(error)
	}
}

exports.getAllReviewsByUser = async function getAllReviewsByUser(userId) {

	const query = "SELECT * FROM reviews WHERE user_id = ?"
	const values = [userId]

	try {
		const response = await db(query, values)
		return response

	} catch (error) {
		console.log("error in getallreviewsbyid")
		console.log(error)
	}
}
