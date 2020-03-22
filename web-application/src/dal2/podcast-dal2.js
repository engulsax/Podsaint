const pgdb = require('./pgdb')
const err = require('../errors/error')

const ratingDatabaseNames = ["overall_rating", "production_quality_rating", "topic_relevence_rating", "comedy_rating", "drama_rating"]
const ratingsVaribleNames = ["overall", "quality", "topic", "comedy", "drama"]

module.exports = function () {

	return {

		newPodcastReview: async function newPodcastReview(
			collectionId, reviewPoster, collectionName, podCreators,
			comedyRating, dramaRating, topicRelevence,
			productionQuality, overallRating, reviewText) {

			try {

				if (!await this.podcastExist(collectionId)) {
					await this.addPodcast(collectionId, collectionName, podCreators)
				}

				await addNewInfoToPodcast(collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating)
				await pgdb.reviews.create({
					review_poster: reviewPoster,
					post_date: new Date(),
					pod_id: collectionId,
					comedy_rating: comedyRating,
					drama_rating: dramaRating,
					topic_relevence_rating: topicRelevence,
					production_quality_rating: productionQuality,
					overall_rating: overallRating,
					review_text: reviewText
				})
				return

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},


		getPodcastById: async function getPodcastById(collectionId) {

			try {
				const result = await pgdb.podcasts.findAll({
					where: { pod_id: collectionId }
				})
				return result

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		addPodcast: async function addPodcast(collectionId, collectionName, podCreators) {

			try {

				return await pgdb.podcasts.create({
					pod_id: collectionId,
					pod_name: collectionName,
					pod_creators: podCreators,
					comedy_rating: 0,
					drama_rating: 0,
					topic_relevence_rating: 0,
					production_quality_rating: 0,
					overall_rating: 0
				})

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		getReviewById: async function getReviewById(reviewId) {

			try {
				const result = await pgdb.reviews.findAll({
					where: { id: reviewId }
				})

				return [result[0].dataValues]

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		updateReviewById: async function updateReviewById(reviewId, reviewText) {

			try {
				return await pgdb.reviews.update(
					{ review_text: reviewText },
					{
						where: { id: reviewId }
					})

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		deleteReviewById: async function deleteReviewById(reviewId, collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating) {

			try {
				await removeRatingFromPodcast(collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating)
				return await pgdb.reviews.destroy(
					{
						where: { id: reviewId }
					})

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		getAllReviewsByPodcastId: async function getAllReviewsByPodcastId(collectionId) {

			try {
				const reviews = await pgdb.reviews.findAll({
					where: { pod_id: collectionId },
					order: [
						['post_date', 'DESC']
					]
				})
				result = []
				for (review of reviews) {
					result.push(review.dataValues)
				}
				return result

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		getNReviewsByPodcastId: async function getNReviewsByPodcastId(collectionId, amount) {

			try {

				const result = await pgdb.reviews.findAll({
					where: { pod_id: collectionId },
					limit: amount,
					order: [
						['post_date', 'DESC']
					]
				})
				const reviews = []
				for (let i = 0; i < result.length; i++) {
					reviews.push(result[i].dataValues)
				}
				return reviews

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		getAllReviewsByUser: async function getAllReviewsByUser(user) {

			try {
				const reviews = await pgdb.reviews.findAll({
					where: { review_poster: user },
					order: [
						['post_date', 'DESC']
					]
				})
				result = []
				for (review of reviews) {
					result.push(review.dataValues)
				}
				return result

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		getNReviewsByUser: async function getNReviewsByPodcastId(user, amount) {

			try {
				const reviews = await pgdb.reviews.findAll({
					where: { review_poster: user },
					limit: amount,
					order: [
						['post_date', "DESC"]
					]
				})
				result = []
				for (review of reviews) {
					result.push(review.dataValues)
				}
				return result


			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		getAverageRatingsByPodcastId: async function getAverageRatingsByPodcastId(collectionId) {

			try {
				const ratings = await getRatingsFromPodcast(collectionId)
				const numberOfReviewsRaw = await getNumberOfReviewsById(collectionId)
				const numberOfReviews = await numberOfReviewsRaw.count

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
				const numberOfReviews = numberOfReviewsRaw.count

				const dramaScoreRaw = await pgdb.podcasts.findAll({
					attributes: ['drama_rating'],
					where: { pod_id: collectionId }
				})

				const comedyScoreRaw = await pgdb.podcasts.findAll({
					attributes: ['comedy_rating'],
					where: { pod_id: collectionId }
				})

				const dramaScore = dramaScoreRaw.drama_rating
				const comedyScore = comedyScoreRaw.comedy_rating

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
				const numberOfReviws = await getNumberOfReviewsById(collectionId)
				return numberOfReviws.count

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		userHasReviews: async function userHasReviews(user) {

			try {
				const numberOfReviws = await getNumberOfReviewsByUser(user)
				return numberOfReviws.count

			} catch (error) {
				console.log(error)
				throw err.err.INTERNAL_SERVER_ERROR
			}
		},

		podcastExist: async function podcastExist(collectionId) {

			try {
				const response = await pgdb.podcasts.count({
					where: { pod_id: collectionId }
				})
				return (response > 0) ? true : false

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

		try {
			return await pgdb.reviews.findAndCountAll({
				where: { pod_id: collectionId }
			})

		} catch (error) {
			console.log(error)
			throw err.err.INTERNAL_SERVER_ERROR
		}
	}

	async function getNumberOfReviewsByUser(user) {

		try {
			return await pgdb.reviews.findAndCountAll({
				where: { review_poster: user }
			})

		} catch (error) {
			console.log(error)
			throw err.err.INTERNAL_SERVER_ERROR
		}
	}

	async function addNewRatingsToPodcast(collectionId, ratingName, ratingScore) {

		try {
			await pgdb.podcasts.update(
				{ [ratingName]: ratingScore },
				{
					where: { pod_id: collectionId }
				})

		} catch (error) {
			console.log(error)
			throw err.err.INTERNAL_SERVER_ERROR
		}
	}

	async function getRatingsFromPodcast(collectionId) {

		try {
			const pod = await pgdb.podcasts.findAll({
				where: { pod_id: collectionId }
			})
			const result = [pod[0].dataValues]
			const ratings = {}

			ratingDatabaseNames.forEach(async function (rating, i) {
				ratings[ratingsVaribleNames[i]] = await result[0][rating]
			})

			return ratings

		} catch (error) {
			console.log(error)
			throw err.err.INTERNAL_SERVER_ERROR
		}
	}
}