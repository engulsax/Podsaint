const conn = require("./db")
const util = require('util')
const err = require('../errors/error')
const db = util.promisify(conn.query).bind(conn)
const ratingDatabaseNames = ["overall_rating", "production_quality_rating", "topic_relevence_rating", "comedy_rating", "drama_rating"]
const ratingsVaribleNames = ["overall", "quality", "topic", "comedy", "drama"]

module.exports = function () {

	return {

		newPodcastReview: async function newPodcastReview(
			collectionId, reviewPoster, collectionName, podCreators,
			comedyRating, dramaRating, topicRelevence, productionQuality,
			overallRating, reviewText) {

			const query = `INSERT INTO reviews(
				review_poster, 
				post_date, 
				pod_id, 
				production_quality_rating, 
				topic_relevence_rating, 
				comedy_rating, drama_rating, 
				overall_rating, 
				review_text
			) 
			VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?)`

			const values = [reviewPoster, collectionId, productionQuality,
				topicRelevence, comedyRating, dramaRating,
				overallRating, reviewText]

			try {

				if (!await this.podcastExist(collectionId)) {
					await this.addPodcast(collectionId, collectionName, podCreators)
				}

				await addNewInfoToPodcast(collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating)
				await db(query, values)

				return

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},


		getPodcastById: async function getPodcastById(collectionId) {
			const query = "SELECT * FROM podcasts WHERE pod_id = ?"
			const value = [collectionId]

			try {
				const response = await db(query, value)
				return response[0].pod_id

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		addPodcast: async function addPodcast(collectionId, collectionName, podCreators) {
			const query = `INSERT INTO podcasts(
				pod_id, 
				pod_name, 
				pod_creators, 
				comedy_rating, 
				drama_rating, 
				topic_relevence_rating, 
				production_quality_rating, 
				overall_rating 
			) 
			VALUES(?, ?, ? ,? ,? ,? ,?, ?)`
			const values = [collectionId, collectionName, podCreators, 0, 0, 0, 0, 0]

			try {
				const response = await db(query, values)
				return response
			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		getReviewById: async function getReviewById(reviewId) {

			const query = "SELECT * FROM reviews WHERE id = ?"
			const values = [reviewId]

			try {
				return await db(query, values)

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		updateReviewById: async function updateReviewById(reviewId, reviewText) {

			const query = "UPDATE reviews SET review_text = ? WHERE id = ?"
			const values = [reviewText, reviewId]

			try {

				return await db(query, values)

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		deleteReviewById: async function deleteReviewById(reviewId, collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating) {

			const query = "DELETE FROM reviews WHERE id = ?"
			const values = [reviewId]

			try {

				await removeRatingFromPodcast(collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating)
				return await db(query, values)

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		getAllReviewsByPodcastId: async function getAllReviewsByPodcastId(collectionId) {

			const query = "SELECT * FROM reviews WHERE pod_id = ? ORDER BY post_date DESC"
			const value = [collectionId]

			try {

				const response = await db(query, value)
				return response

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		getNReviewsByPodcastId: async function getNReviewsByPodcastId(collectionId, amount) {

			const query = "SELECT * FROM reviews WHERE pod_id = ? ORDER BY post_date DESC LIMIT ?"
			const value = [collectionId, amount]

			try {
				const response = await db(query, value)
				return response
			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		getAllReviewsByUser: async function getAllReviewsByUser(user) {

			const query = "SELECT * FROM reviews WHERE review_poster = ? ORDER BY post_date DESC"
			const value = [user]

			try {
				const response = await db(query, value)
				return response

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		getNReviewsByUser: async function getNReviewsByPodcastId(user, amount) {

			const query = "SELECT * FROM reviews WHERE review_poster = ? ORDER BY post_date DESC LIMIT ?"
			const value = [user, amount]

			try {
				const response = await db(query, value)
				return response
			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		getAverageRatingsByPodcastId: async function getAverageRatingsByPodcastId(collectionId) {

			/*Unnecessary awaits ?*/

			try {
				const ratings = await getRatingsFromPodcast(collectionId)
				const numberOfReviewsRaw = await getNumberOfReviewsById(collectionId)
				const numberOfReviews = await numberOfReviewsRaw[0]["COUNT(*)"]

				const averageRatings = {}
				for (key in ratings) {
					averageRatings[key] = Math.round(ratings[key] / (await numberOfReviews))
				}

				return averageRatings

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		getToneInformationByPodcastId: async function getToneInformationByPodcastId(collectionId) {
			try {

				toneInformation = {}

				const numberOfReviewsRaw = await getNumberOfReviewsById(collectionId)
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

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		podcastHasReviews: async function podcastHasReviews(collectionId) {

			try {
				const numberOfReviews = await getNumberOfReviewsById(collectionId)
				return numberOfReviews[0]['COUNT(*)']
			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		userHasReviews: async function userHasReviews(user) {

			try {
				const numberOfReviws = await getNumberOfReviewsByUser(user)
				return numberOfReviws[0]['COUNT(*)']
			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}

		},

		podcastExist: async function podcastExist(collectionId) {
			try {
				const query = "SELECT EXISTS(SELECT * FROM podcasts WHERE pod_id = ?) as response"
				const value = [collectionId]
				const response = await db(query, value)
				return (response[0]['response'])
			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		}
	}

	async function addNewInfoToPodcast(collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating) {

		try {
			const ratings = await getRatingsFromPodcast(collectionId)

			ratings.overall += overallRating
			ratings.quality += productionQuality
			ratings.topic += topicRelevence
			ratings.drama += dramaRating
			ratings.comedy += comedyRating

			/*Finding all value in objects with the help of ratingsVaribleNames'
			which has the name of all the keys aka the varible names (in this case)*/
			ratingDatabaseNames.forEach(async function (rating, i) {
				await addNewRatingsToPodcast(collectionId, rating, ratings[ratingsVaribleNames[i]])
			})

		} catch (error) {
			console.log(error)
			throw err.err.INTERNAL_SERVER_ERROR
		}
	}
	async function removeRatingFromPodcast(collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating) {

		try {
			const ratings = await getRatingsFromPodcast(collectionId)

			ratings.overall -= overallRating
			ratings.quality -= productionQuality
			ratings.topic -= topicRelevence
			ratings.drama -= dramaRating
			ratings.comedy -= comedyRating

			/*Finding all value in objects with the help of ratingsVaribleNames'
			which has the name of all the keys aka the varible names (in this case)*/
			ratingDatabaseNames.forEach(async function (rating, i) {
				await addNewRatingsToPodcast(collectionId, rating, ratings[ratingsVaribleNames[i]])
			})

		} catch (error) {
			console.log(error)
			throw err.err.INTERNAL_SERVER_ERROR
		}
	}

	async function getNumberOfReviewsById(collectionId) {
		query = "SELECT COUNT(*) FROM reviews WHERE pod_id = ?"
		value = [collectionId]
		try {
			return await db(query, value)
		} catch (error) {
			console.log(error)
			throw err.err.INTERNAL_SERVER_ERROR
		}
	}

	async function getNumberOfReviewsByUser(user) {
		query = "SELECT COUNT(*) FROM reviews WHERE review_poster = ?"
		value = [user]

		try {
			return await db(query, value)
		} catch (error) {
			console.log(error)
			throw err.err.INTERNAL_SERVER_ERROR
		}
	}

	async function addNewRatingsToPodcast(collectionId, ratingName, ratingScore) {
		query = "UPDATE podcasts SET " + ratingName + " = ? WHERE pod_id = ?"

		values = [ratingScore, collectionId]
		try {
			await db(query, values)
		} catch (error) {
			console.log(error)
			throw err.err.INTERNAL_SERVER_ERROR
		}
	}

	async function getRatingsFromPodcast(collectionId) {

		query = "SELECT * FROM podcasts WHERE pod_id = ?"
		value = [collectionId]

		try {
			const result = await db(query, value)
			const ratings = {}

			ratingDatabaseNames.forEach(async function (rating, i) {
				ratings[ratingsVaribleNames[i]] = result[0][rating]
			})

			return ratings
		} catch (error) {
			console.log(error)
			throw err.err.INTERNAL_SERVER_ERROR
			//return ratings
		}
	}
}