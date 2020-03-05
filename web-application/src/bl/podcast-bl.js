const err = require('../errors/error')
const axios = require("axios")
const cheerio = require('cheerio')

module.exports = function ({ podcastDAL, authBL }) {

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
            reviewText,
            userLoginKey
        ) {

            if (!authBL.isLoggedIn(userLoginKey)) {
                console.log("error - newPodcastReview - podcast-bl.js")
                throw err.err.AUTH_USER_ERROR
            }

            const errorMessages = reviewInputUndefinedMessage(overallRating, topicRelevence, toneRating, productionQuality)
            console.log(errorMessages)
            if (errorMessages.length != 0) {
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
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        getAllReviewsByPodcastId: async function getAllReviewsByPodcastId(collectionId, userLoginKey) {

            try {
                if (await podcastDAL.podcastHasReviews(collectionId)) {
                    let reviews = await podcastDAL.getAllReviewsByPodcastId(collectionId)
                    reviews = addMyReviewsFlag(userLoginKey, reviews)
                    return { result: reviews, amount: postPerPage }
                }
                return []
            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR

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
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        getThreeReviewsByPodcastId: async function getThreeReviewsByPodcastId(collectionId, userLoginKey) {

            const numberOfReviews = 3
            try {
                if (await podcastDAL.podcastHasReviews(collectionId)) {
                    let reviews = await podcastDAL.getNReviewsByPodcastId(collectionId, numberOfReviews)
                    reviews = addMyReviewsFlag(userLoginKey, reviews)
                    return reviews
                }
                return []
            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        getThreeReviewsByUser: async function getThreeReviewsByUser(userLoginKey) {

            const numberOfReviews = 3
            try {
                if (await podcastDAL.userHasReviews(userLoginKey.user)) {
                    return await podcastDAL.getNReviewsByUser(userLoginKey.user, numberOfReviews)
                }
                return []
            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        getNReviewsByPodcastId: async function getNReviewsByPodcastId(collectionId, value, userLoginKey) {

            const postPerPage = 3
            try {
                if (value == "all") {
                    if (await podcastDAL.podcastHasReviews(collectionId)) {
                        let reviews = await podcastDAL.getAllReviewsByPodcastId(collectionId, value)
                        reviews = addMyReviewsFlag(userLoginKey, reviews)
                        return { result: reviews, amount: postPerPage }
                    }
                    return []
                } else {
                    if (value === undefined) {
                        value = postPerPage
                    } else {
                        value = parseInt(value)
                        value += postPerPage
                    }
                    if (await podcastDAL.podcastHasReviews(collectionId)) {
                        const reviews = await podcastDAL.getNReviewsByPodcastId(collectionId, value)
                        addMyReviewsFlag(userLoginKey, reviews)
                        return { result: reviews, amount: value }
                    }
                    return []
                }
            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR

            }
        },

        getNReviewsByUser: async function getNReviewsByUser(user, value) {

            const postPerPage = 3
            try {
                if (value == "all") {
                    if (await podcastDAL.userHasReviews(user)) {
                        return { result: await podcastDAL.getAllReviewsByUser(user), amount: postPerPage }
                    }
                    return []
                } else {
                    if (value === undefined) {
                        value = postPerPage
                    } else {
                        value = parseInt(value)
                        value += postPerPage
                    }
                    if (await podcastDAL.userHasReviews(user)) {
                        return { result: await podcastDAL.getNReviewsByUser(user, value), amount: value }
                    }
                    return []
                }
            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
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

                    return ratingInformation
                }

                ratingInformation.tone = "none"
                ratingInformation.average = "none"

                return ratingInformation

            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        fetchPodInfo: async function (url) {
            return fetchPodInfo(url)
        }
    }
    function addMyReviewsFlag(userLoginKey, reviews) {

        if (authBL.isLoggedIn(userLoginKey)) {
            for (review of reviews) {
                if (review.review_poster === userLoginKey.user) {
                    review.myReview = true
                }
            }
        }
        return reviews
    }

    function reviewInputUndefinedMessage(overallRating, topicRelevence, toneRating, productionQuality) {
        errorMessages = []

        if (overallRating <= 0 || overallRating > 5) {
            errorMessages.push("invalid overall rating")
        }

        if (toneRating !== "comedy" && toneRating !== "drama") {
            errorMessages.push("invalid tone rating")
        }

        if (topicRelevence <= 0 || topicRelevence > 5) {
            errorMessages.push("invalid topic relevance rating")
        }

        if (productionQuality <= 0 || productionQuality > 5) {
            errorMessages.push("invalid production quality rating")
        }

        return errorMessages
    }

    async function fetchPodInfo(url) {
        const html = await axios.get(url)
        const $ = cheerio.load(html.data)
        return $('.product-hero-desc').find('p').first().text()
    }

}

