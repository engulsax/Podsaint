const pgdb = require('./pgdb')

const ratingDatabaseNames = ["overall_rating", "production_quality_rating", "topic_relevence_rating", "comedy_rating", "drama_rating"]
const ratingsVaribleNames = ["overall", "quality", "topic", "comedy", "drama"]

module.exports = function({}){

	return{

		newPodcastReview: async function newPodcastReview(collectionId, reviewPoster, collectionName, podCreators, comedyRating, dramaRating, topicRelevence, productionQuality, overallRating, reviewText) {

			try {
                const podcast = await this.getPodcastById(collectionId)
                if(podcast.length == 0){
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
				console.log("error when write new review in db")
			}
		},
			
		
		getPodcastById: async function getPodcastById(collectionId) {
    
			try {
                const result =  await pgdb.podcasts.findAll({
                    where:{ pod_id: collectionId}
				})
				console.log("GET PODCAST BY ID ")
				console.log(result)
				return result

			} catch (error) {
				console.log(error)
				console.log("error in getPodcastById")
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
				console.log("error in addPodcast")
				console.log(error)
			}
		},
		
		getAllReviewsByPodcastId: async function getAllReviewsByPodcastId(collectionId) {
			
			try {
                return await pgdb.reviews.findAll({
                    where: {pod_id: collectionId },
                    order:[
                        ['post_date', 'DESC']
                    ]
                })

			} catch (error) {
				console.log("error in getallreviewsbypodcast")
				console.log(error)
			}
		},

		getNReviewsByPodcastId: async function getNReviewsByPodcastId(collectionId, amount) {
		       
			try {
				console.log("-------------------getNreviewsbypodcastid")
				console.log(amount)
				console.log("-------------------getNreviewsbypodcastid")

                const result =  await pgdb.reviews.findAll({
                    where:{ pod_id: collectionId},
                    limit: amount,
                    order:[
                        ['post_date','DESC']
                    ]
				})
				const reviews = []
				for(let i = 0; i < result.length; i++){
					reviews.push(result[i].dataValues)
				}
				return reviews

			} catch (error) {
				console.log("error in getallreviewsbypodcast")
				console.log(error)
			}
		},
		
		getAllReviewsByUser: async function getAllReviewsByUser(user) {
			
			try {
                return await pgdb.reviews.findAll({
                    where:{ review_poster: user},
                    order: [
                        ['post_date', 'DESC']
                    ]
                })
                
			} catch (error) {
				console.log("error in getallreviewsbyid")
				console.log(error)
			}
		},

		getNReviewsByUser: async function getNReviewsByPodcastId(user, amount) {

			try {
                return await pgdb.reviews.findAll({
                    where:{ review_poster: user},
                    limit: amount,
                    order: [
                        ['post_date', "DESC"]
                    ]
				})
				
			} catch (error) {
				console.log("error in getallreviewsbypodcast")
				console.log(error)
			}
		},

		getAverageRatingsByPodcastId: async function getAverageRatingsByPodcastId(collectionId) {

			/*Unnecessary awaits ?*/
		
			try {
                const ratings = await getRatingsFromPodcast(collectionId)
				const numberOfReviewsRaw = await getNumberOfReviewsById(collectionId)
				const numberOfReviews = await numberOfReviewsRaw.count
				
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
		
			const numberOfReviewsRaw = await getNumberOfReviewsById(collectionId)
			const numberOfReviews = numberOfReviewsRaw.count
		
            const dramaScoreRaw = await pgdb.podcasts.findAll({
                attributes: ['drama_rating'],
                where: {pod_id: collectionId}
            })

			const comedyScoreRaw = await pgdb.podcasts.findAll({
                attributes: ['comedy_rating'],
                where: {pod_id: collectionId} 
            })

			//const dramaScore = dramaScoreRaw[0]['drama_rating']
			//const comedyScore = comedyScoreRaw[0]['comedy_rating']
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
		},
	
		
		
		podcastHasReviews: async function podcastHasReviews(collectionId){
			const numberOfReviws = await getNumberOfReviewsById(collectionId)
			console.log("NUMBEROFREVIEES PODDD MUTTAFUKKA")
			console.log(numberOfReviws.count)
			return numberOfReviws.count
			//console.log("NUMBER OF MF REVIES------"+numberOfReviws[0]['COUNT(*)'])
			//return numberOfReviws[0]['COUNT(*)']
		},

		userHasReviews: async function userHasReviews(user){

			const numberOfReviws = await getNumberOfReviewsByUser(user)
			console.log("NUMBEROFREVIEES MUTTAFUKKA")
			console.log(numberOfReviws.count)
			return numberOfReviws.count
			//console.log("NUMBER OF MF REVIES------"+numberOfReviws[0]['COUNT(*)'])
			//return numberOfReviws[0]['COUNT(*)']
		
		}
		
	}
}

async function addNewInfoToPodcast(collectionId, productionQuality, topicRelevence, comedyRating, dramaRating, overallRating) {

	try {

		const ratings = await getRatingsFromPodcast(collectionId)
		
		//console.log("RATINGS_-------------------------------------")
		//console.log(ratings)
		/*RATINGS---------------------------
         { overall: 0, quality: 0, topic: 0, comedy: 0, drama: 0 }*/
		/* console.log(overallRating)
		 console.log(productionQuality)
		 console.log(topicRelevence)
		 console.log(dramaRating)
		 console.log(comedyRating)*/
	
		 

		ratings.overall += overallRating
		ratings.quality += productionQuality
		ratings.topic += topicRelevence
		ratings.drama += dramaRating
		ratings.comedy += comedyRating
		console.log("--------ratatatatatatata-------")
		 console.log(ratings)
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

async function getNumberOfReviewsById(collectionId) {

    return await pgdb.reviews.findAndCountAll({
        where: {pod_id: collectionId}
    })
}

async function getNumberOfReviewsByUser(user) {

    return await pgdb.reviews.findAndCountAll({
        where: {review_poster: user}
    })
}

async function addNewRatingsToPodcast(collectionId, ratingName, ratingScore) {
	
    pgdb.podcasts.update(
        {[ratingName]: ratingScore},
        {where: {pod_id: collectionId}
    })
}

async function getRatingsFromPodcast(collectionId) {

	try {
        const pod = await pgdb.podcasts.findAll({
            where:{ pod_id: collectionId}
		})
		const result = [pod[0].dataValues]
		const ratings = {}

		/*RATINGS FROM PODCASTS_----------------------
					[
  					RowDataPacket {
  						pod_id: '120867842',
  						pod_name: 'Mac OS Ken',
   						pod_creators: 'Ken Ray',
  						comedy_rating: 0,
 						drama_rating: 1,
						topic_relevence_rating: 3,
						production_quality_rating: 5,
						overall_rating: 4
					}
					]

						const result = await db(query, value)
		console.log("RATINGS FROM PODCASTS_----------------------")
		console.log(result)
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