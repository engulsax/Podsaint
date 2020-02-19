
const reviewDAL = require('../dal/podcast-dal')

const DRAMA = 0
const COMEDY = 1


exports.newPodcastReview = async function newPodcastReview(collectionId, collectionName, toneRating, topicRelevence, productionQualty, overallRating, reviewText) {

    let dramaRating = 0
    let comedyRating = 0
    if (toneRating === COMEDY) {
        comedyRating = 1
    } else {
        dramaRating = 1
    }

    try {
        console.log("kommit hit hit")

        return await reviewDAL.newPodcastReview(collectionId, collectionName, comedyRating, dramaRating, topicRelevence, productionQualty, overallRating, reviewText)

    } catch{
        //error
        console.log("podcast-bl-error")
    }
}

exports.getAllReviewsByPodcastId = async function getAllReviewsByPodcastId(collectionId) {

    try {
        if (await reviewDAL.podcastHasReviews(collectionId)) {
            return await reviewDAL.getAllReviewsByPodcastId(collectionId)
        }
        return []
    } catch{
        //error
        console.log("get all reviewsbypodcastid error")

    }
}


exports.getRatingInformationByPodcastId = async function getRatingInformationByPodcastId(collectionId) {

    try {
        const ratingInformation = {}
        if (await reviewDAL.podcastHasReviews(collectionId)) {

            const ratingInformation = {}

            ratingInformation.average = await reviewDAL.getAverageRatingsByPodcastId(collectionId)

            /*returns tone of podcast - comdey | drama, as well as the precentage of tone choices*/
            ratingInformation.tone = await reviewDAL.getToneInformationByPodcastId(collectionId)

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
