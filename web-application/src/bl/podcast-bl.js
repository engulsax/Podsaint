
const DRAMA = 0
const COMEDY = 1

module.exports = function ({ podcastDAL }) {

    return {
        newPodcastReview: async function newPodcastReview(collectionId, collectionName, toneRating, topicRelevence, productionQualty, overallRating, reviewText) {

            let dramaRating = 0
            let comedyRating = 0
            if (toneRating === COMEDY) {
                comedyRating = 1
            } else {
                dramaRating = 1
            }

            try {
                console.log("kommit hit hit")

                return await podcastDAL.newPodcastReview(collectionId, collectionName, comedyRating, dramaRating, topicRelevence, productionQualty, overallRating, reviewText)

            } catch{
                //error
                console.log("podcast-bl-error")
            }
        },

        getAllReviewsByPodcastId: async function getAllReviewsByPodcastId(collectionId) {

            try {
                if (await podcastDAL.podcastHasReviews(collectionId)) {
                    return await podcastDAL.getAllReviewsByPodcastId(collectionId)
                }
                return []
            } catch{
                //error
                console.log("get all reviewsbypodcastid error")

            }
        },


        getRatingInformationByPodcastId: async function getRatingInformationByPodcastId(collectionId) {

            try {
                const ratingInformation = {}
                if (await podcastDAL.podcastHasReviews(collectionId)) {

                    const ratingInformation = {}

                    ratingInformation.average = await podcastDAL.getAverageRatingsByPodcastId(collectionId)

                    /*returns tone of podcast - comdey | drama, as well as the precentage of tone choices*/
                    ratingInformation.tone = await podcastDAL.getToneInformationByPodcastId(collectionId)

                    console.log("RATING RATING ----- " + JSON.stringify(ratingInformation))

                    return ratingInformation
                }

                ratingInformation.tone = "none"
                ratingInformation.average = "none"

                return ratingInformation

            } catch (error) {
                //error

                console.log("getRatingInformationByPodcastId error")
                console.log(error)
            }
        }
    }
}
