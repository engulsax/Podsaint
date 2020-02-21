
const axios = require("axios")
const cheerio = require('cheerio')

module.exports = function ({ podcastDAL }) {

    return {
        newPodcastReview: async function newPodcastReview(
            collectionId,
            reviewPoster,
            collectionName,
            podCreators,
            toneRating,
            topicRelevence,
            productionQualty,
            overallRating,
            reviewText
        ) {

            let dramaRating = 0
            let comedyRating = 0
            if (toneRating === "comedy") {
                comedyRating = 1
            } else {
                dramaRating = 1
            }

            try {
                console.log("kommit hit hit")

                return await podcastDAL.newPodcastReview(
                    collectionId,
                    reviewPoster,
                    podCreators,
                    collectionName,
                    comedyRating,
                    dramaRating,
                    topicRelevence,
                    productionQualty,
                    overallRating,
                    reviewText
                )

            } catch(error){
                console.log(error)
                console.log("podcast-bl-error")
            }
        },

        getAllReviewsByPodcastId: async function getAllReviewsByPodcastId(collectionId) {

            try {
                if (await podcastDAL.podcastHasReviews(collectionId)) {
                    return await podcastDAL.getAllReviewsByPodcastId(collectionId)
                }
                return []
            } catch(error){
                console.log(error)
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
                console.log("getRatingInformationByPodcastId error")
                console.log(error)
            }
        },

        fetchPodInfo: async function (url) {
            return fetchPodInfo(url)
        }
    }
}

async function fetchPodInfo(url) {
    const html = await axios.get(url)
    const $ = cheerio.load(html.data)
    return $('.product-hero-desc').find('p').first().text()
}