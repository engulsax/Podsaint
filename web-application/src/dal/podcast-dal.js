

const conn = require("./db")
const util = require('util')
const db = util.promisify(conn.query).bind(conn)
const ratingDatabaseNames = ["overall_rating", "production_quality_rating", "topic_relevence_rating", "comedy_rating", "drama_rating"]
const ratingsVaribleNames = ["overall", "quality", "topic", "comedy", "drama"]

module.exports = function({}){
	
	return{

		newPodcastReview: async function newPodcastReview(collectionId, collectionName, comedyRating, dramaRating, topicRelevence, productionQuality, overallRating, reviewText) {

			const userId = 1
			const query = "INSERT INTO reviews (user_id, pod_id, production_quality_rating, topic_relevence_rating, comedy_rating, drama_rating, overall_rating, review_text) VALUES(?, ?, ?, ?, ?, ?, ?, ?)"
			const values = [userId, collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating, reviewText]
		
			try {
		
				const podcast = await this.getPodcastById(collectionId)
		
				if (podcast == undefined) {
		
					await this.addPodcast(collectionId, collectionName)
				}
		
				await addNewInfoToPodcast(collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating)
				await db(query, values)
		
				return
		
			} catch (error) {
				console.log(error)
				console.log("error when write new review in db")
			}
		},
			
		
		getPodcastById: async function getPodcastById(collectionId) {
		
		
			const query = "SELECT * FROM podcasts WHERE pod_id = ?"
			const value = [collectionId]
		
			try {
				const response = await db(query, value)
				//console.log(response)
				return response[0].pod_id
		
			} catch (error) {
				console.log(error)
				console.log("error in getPodcastById")
			}
		},
		
		addPodcast: async function addPodcast(collectionId, collectionName) {
			const query = "INSERT INTO podcasts(pod_id, pod_name, comedy_rating, drama_rating, topic_relevence_rating, production_quality_rating, overall_rating) VALUES(?, ?, ? ,? ,? ,? ,?)"
			const values = [collectionId, collectionName, 0, 0, 0, 0, 0]
		
			try {
				const response = await db(query, values)
				return response
			} catch (error) {
				console.log("error in addPodcast")
				console.log(error)
			}
		},
		
		getAllReviewsByPodcastId: async function getAllReviewsByPodcastId(collectionId) {
		
			const query = "SELECT * FROM reviews WHERE pod_id = ?"
			const value = [collectionId]
		
			try {
				const response = await db(query, value)
				return response
			} catch (error) {
				console.log("error in getallreviewsbypodcast")
				console.log(error)
			}
		},
		
		getAllReviewsByUser: async function getAllReviewsByUser(userId) {
		
			const query = "SELECT * FROM reviews WHERE user_id = ?"
			const value = [userId]
		
			try {
				const response = await db(query, value)
				return response
		
			} catch (error) {
				console.log("error in getallreviewsbyid")
				console.log(error)
			}
		},

		getAverageRatingsByPodcastId: async function getAverageRatingsByPodcastId(collectionId) {

			/*Unnecessary awaits ?*/
		
			try {
				const ratings = await getRatingsFromPodcast(collectionId)
				const numberOfReviewsRaw = await getNumberOfReviews(collectionId)
				const numberOfReviews = await numberOfReviewsRaw[0]["COUNT(*)"]
				
				const averageRatings = {}
				for (key in ratings) {
					averageRatings[key] = Math.round(ratings[key] / (await numberOfReviews))
					console.log("average ratings---------- " + await averageRatings[key])
				}
		
				return averageRatings
		
			} catch (error) {
				console.log("error in getAverageRatingsByPodcastId")
				console.log(error)
			}
		},
		
		getToneInformationByPodcastId: async function getToneInformationByPodcastId(collectionId) {
		
			toneInformation = {}
		
			const numberOfReviewsRaw = await getNumberOfReviews(collectionId)
			const numberOfReviews = numberOfReviewsRaw[0]["COUNT(*)"]
		
			dramaQuery = "SELECT drama_rating FROM podcasts WHERE pod_id = ?"
			comedyQuery = "SELECT comedy_rating FROM podcasts WHERE pod_id = ?"
		
			value = [collectionId]
		
			const dramaScoreRaw = await db(dramaQuery, value)
			const comedyScoreRaw = await db(comedyQuery, value)
			const dramaScore = dramaScoreRaw[0]['drama_rating']
			const comedyScore = comedyScoreRaw[0]['comedy_rating']
		
			if (dramaScore < comedyScore) {
				toneInformation.mostPicked = "Comedy/Relaxed"
				/*mulitplication by 100 to make decimal into precentage*/
				toneInformation.precentage = Math.round(((comedyScore) / numberOfReviews) * 100)
			} else {
				toneInformation.mostPicked = "Drama/Serious"
				toneInformation.precentage = Math.round(((dramaScore) / numberOfReviews) * 100)
			}
		
			return toneInformation
		},
		
		podcastHasReviews: async function podcastHasReviews(collectionId){
			const numberOfReviws = await getNumberOfReviews(collectionId)
			console.log("NUMBER OF MF REVIES------"+numberOfReviws[0]['COUNT(*)'])
			return numberOfReviws[0]['COUNT(*)']
		}
		
	}
}

async function addNewInfoToPodcast(collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating) {

	try {
		const ratings = await getRatingsFromPodcast(collectionId)

		ratings.overall += await overallRating
		ratings.quality += await productionQuality
		ratings.topic += await topicRelevence
		ratings.drama += await dramaRating
		ratings.comedy += await comedyRating

		/*Finding all value in objects with the help of ratingsVaribleNames'
		which has the name of all the keys aka the varible names (in this case)*/
		ratingDatabaseNames.forEach(async function (rating, i) {
			await addNewRatingsToPodcast(collectionId, rating, ratings[ratingsVaribleNames[i]])
		})

	} catch (error) {
		console.log(error)
		//throw(error)
	}

}

/* WHAT AM I DOING?*/

async function getNumberOfReviews(collectionId) {
	query = "SELECT COUNT(*) FROM reviews WHERE pod_id = ?"
	value = [collectionId]

	return await db(query, value)
}

async function addNewRatingsToPodcast(collectionId, ratingName, ratingScore) {
	query = "UPDATE podcasts SET " + ratingName + " = ? WHERE pod_id = ?"
	values = [ratingScore, collectionId]
	db(query, values)
}

async function getRatingsFromPodcast(collectionId) {

	query = "SELECT * FROM podcasts WHERE pod_id = ?"
	value = [collectionId]

	try {

		const result = await db(query, value)
		const ratings = {}

		/*async - await unecessary?*/
		ratingDatabaseNames.forEach(async function (rating, i) {
			ratings[ratingsVaribleNames[i]] = await result[0][rating]
		})

		return ratings
	} catch (error) {
		console.log(error)
		return ratings
		//throw error
	}
}