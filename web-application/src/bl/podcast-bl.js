

module.exports = function ({ podcastDAL }) {

    return {
        newPodcastReview: async function (collectionId, comedyRating, factRating, productionQualty, overallRating, reviewText, seriousnessRating) {

            try {

                return await podcastDAL.newPodcastReview(collectionId, comedyRating, factRating, productionQualty, overallRating, reviewText, seriousnessRating)

            } catch{
                //error
                console.log("podcast-bl-error")
            }
        },

        getAllReviewsByPodcastId: async function (collectionId) {

            try {
                return await podcastDAL.getAllReviewsByPodcastId(collectionId)
            } catch{
                //error
                console.log("get all reviewsbypodcastid error")

            }
        }
    }
}
