
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
            productionQuality,
            overallRating,
            reviewText
        ) {

            const errorMessages = reviewInputUndefinedMessage(overallRating, topicRelevence, toneRating, productionQuality)
            console.log(errorMessages)
            if(errorMessages.length != 0){
                return errorMessages
            }

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
                    productionQuality,
                    overallRating,
                    reviewText
                )

            } catch (error) {
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
            } catch (error) {
                console.log(error)
                console.log("get all reviewsbypodcastid error")

            }
        },

        getAllReviewsByUser: async function getAllReviewsByUser(userId) {

            try {
                if (await podcastDAL.userHasReviews(userId)) {
                    return await podcastDAL.getAllReviewsByUser(userId)
                }
                return []
            } catch (error) {
                console.log(error)
                console.log("get all reviewsbypodcastid error")

            }
        },

        getThreeReviewsByPodcastId: async function getThreeReviewsByPodcastId(collectionId) {

            const numberOfReviews = 3
            try {
                if (await podcastDAL.podcastHasReviews(collectionId)) {
                    return await podcastDAL.getNReviewsByPodcastId(collectionId, numberOfReviews)
                }
                return []
            } catch (error) {
                console.log(error)
                console.log("get all reviewsbypodcastid error")

            }
        },

        getThreeReviewsByUser: async function getThreeReviewsByUser(user) {

            const numberOfReviews = 3
            try {
                if (await podcastDAL.userHasReviews(user)) {
                    return await podcastDAL.getNReviewsByUser(user, numberOfReviews)
                }
                return []
            } catch (error) {
                console.log(error)
                console.log("get all reviewsbypodcastid error")

            }
        },

        getNReviewsByPodcastId: async function getNReviewsByPodcastId(collectionId, value) {

            const postPerPage = 3
            try {
                if (value == "all") {
                    if (await podcastDAL.podcastHasReviews(collectionId)) {
                        return {result: await podcastDAL.getAllReviewsByPodcastId(collectionId), amount: postPerPage}
                    }
                    return []
                } else {
                    if(value === undefined){
                        value = postPerPage
                    } else {
                        value = parseInt(value)
                        value += postPerPage
                    }
                    if (await podcastDAL.podcastHasReviews(collectionId)) {
                        return {result: await podcastDAL.getNReviewsByPodcastId(collectionId, value), amount: value}
                    }
                    return []
                }
            } catch (error) {
                console.log(error)
                console.log("get all reviewsbypodcastid error")

            }
        },

        getNReviewsByUser: async function getNReviewsByUser(user, value) {

            const postPerPage = 3
            try {
                if (value == "all") {
                    if (await podcastDAL.userHasReviews(user)) {
                        return {result: await podcastDAL.getAllReviewsByUser(user), amount: postPerPage}
                    }
                    return []
                } else {
                    if(value === undefined){
                        value = postPerPage
                    } else {
                        value = parseInt(value)
                        value += postPerPage
                    }
                    if (await podcastDAL.userHasReviews(user)) {
                        return {result: await podcastDAL.getNReviewsByUser(user, value), amount: value}
                    }
                    return []
                }
            } catch (error) {
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

function  reviewInputUndefinedMessage(overallRating, topicRelevence, toneRating, productionQuality){
    errorMessages = []

    console.log("overallRating: " +overallRating+ "topicRelevence: " +topicRelevence+ "toneRating: " +toneRating+ "productionQuality: " +productionQuality)

    if(overallRating <= 0 || overallRating > 5){
        errorMessages.push("invalid overall rating")
    }

    if(toneRating !== "comedy" && toneRating !=="drama"){
        errorMessages.push("invalid tone rating")
    }

    if(topicRelevence <= 0 || topicRelevence > 5){
        errorMessages.push("invalid topic relevance rating")
    }

    if(productionQuality <= 0 || productionQuality > 5){
        errorMessages.push("invalid production quality rating")
    }

    return errorMessages
}

async function fetchPodInfo(url) {
    const html = await axios.get(url)
    const $ = cheerio.load(html.data)
    return $('.product-hero-desc').find('p').first().text()
}