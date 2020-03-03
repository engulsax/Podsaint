const conn = require("./db")
const util = require('util')
const db = util.promisify(conn.query).bind(conn)

module.exports = function () {

    return {

        getPodcastWithNameOrCreator: async function (searchTerm) {
            query = "SELECT * FROM podcasts WHERE pod_name LIKE CONCAT(?, '%') OR pod_creators LIKE CONCAT(?, '%')"
            value = [searchTerm, searchTerm]
            try{
                const result = await db(query, value)
                console.log(`RESULT FROM SEARCH>>>>>>>>>>>>>>>>>> ${result}`)
            }
            catch{

            } 
        },
        
        checkIfPodIsOverMinOverallRating: async function (podId, min) {
            query = "SELECT overall_rating FROM podcasts WHERE pod_id = ?"
            value = [podId]
            const rating = await db(query, value)
            const average = await getAverageRatingsByPodcastId(podId, rating[0].overall_rating)

            return(average > min)
        },

        checkIfPodIsOverMinTopicRelevenceRating: async function (podId, min) {
            query = "SELECT topic_relevence_rating FROM podcasts WHERE pod_id = ?"
            value = [podId]
            const rating = await db(query, value)
            const average = await getAverageRatingsByPodcastId(podId, rating[0].topic_relevence_rating)
            
            return(average > min)
        },

        checkIfPodIsOverMinProductionQualityRating: async function (podId, min) {

            query = "SELECT production_quality_rating FROM podcasts WHERE pod_id = ?"
            value = [podId]
            const rating = await db(query, value)

            const average = await getAverageRatingsByPodcastId(podId, rating[0].production_quality_rating)

            return(average > min)
        },

        checkIfPodToneIsComedy: async function (podId){
            query = "SELECT * FROM podcasts WHERE pod_id = ?"
            value = [podId]
            const response = await db(query, podId)

            return(response[0].comedy_rating > response[0].drama_rating)
        }
    }
}

async function getNumberOfReviews(podId) {
	query = "SELECT COUNT(*) FROM reviews WHERE pod_id = ?"
	value = [podId]

	return await db(query, value)
}

async function getAverageRatingsByPodcastId(podId, rating) {

    try {
        const numberOfReviewsRaw = await getNumberOfReviews(podId)
        const numberOfReviews = await numberOfReviewsRaw[0]["COUNT(*)"]

        console.log("REV NUM "+ numberOfReviews + " RATING" + rating)
        
        return rating/numberOfReviews

    } catch (error) {
        console.log("error in getAverageRatingsByPodcastId")
        console.log(error)
    }
}