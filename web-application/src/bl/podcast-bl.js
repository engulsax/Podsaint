const err = require('../errors/error')
const axios = require("axios")
const cheerio = require('cheerio')

module.exports = function ({ podcastDAL, authBL, searchItunesBL }) {

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
            try {

                if (authBL.isLoggedIn(userLoginKey)) {

                    reviewInputUndefinedMessage(overallRating, topicRelevence, toneRating, productionQuality)

                    let dramaRating = 0
                    let comedyRating = 0
                    if (toneRating === "comedy") {
                        comedyRating = 1
                    } else {
                        dramaRating = 1
                    }

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
                } else {
                    console.log("error - newPodcastReview - podcast-bl.js")
                    throw err.err.AUTH_USER_ERROR
                }

            } catch (error) {
                console.log(error)
                if (err.errorNotExist(error)) {
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }
        },

        getReviewById: async function getReviewById(reviewId) {

            try {
                const result = await podcastDAL.getReviewById(reviewId)
                return result

            } catch (error) {
                console.log(error)
                if (err.errorNotExist(error)) {
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }

        },

        deleteReviewById: async function deleteReviewById(reviewId, userLoginKey) {

            try {

                if (authBL.isLoggedIn(userLoginKey)) {

                    const result = await podcastDAL.getReviewById(reviewId)

                    const collectionId = result[0].pod_id
                    const productionQuality = result[0].production_quality_rating
                    const topicRelevence = result[0].topic_relevence_rating
                    const comedyRating = result[0].comedy_rating
                    const dramaRating = result[0].drama_rating
                    const overallRating = result[0].overall_rating

                    return podcastDAL.deleteReviewById(
                        reviewId, collectionId,
                        productionQuality, topicRelevence,
                        comedyRating, dramaRating, overallRating
                    )
                } else {
                    throw err.err.AUTH_USER_ERROR
                }

            } catch (error) {
                console.log(error)
                if (err.errorNotExist(error)) {
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }
        },

        updateReviewById: async function updateReviewById(reviewId, reviewText, userLoginKey) {

            try {
                if (authBL.isLoggedIn(userLoginKey)) {
                    return await podcastDAL.updateReviewById(reviewId, reviewText)
                } else {
                    throw err.err.AUTH_USER_ERROR
                }
            } catch (error) {
                onsole.log(error)
                if (err.errorNotExist(error)) {
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
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

        getAllReviewsByUser: async function getAllReviewsByUser(userLoginKey) {

            try {
                if (authBL.isLoggedIn(userLoginKey)) {
                    if (await podcastDAL.userHasReviews(userLoginKey.user)) {
                        return await podcastDAL.getAllReviewsByUser(userLoginKey.user)
                    }
                    return []
                } else {
                    throw err.err.AUTH_USER_ERROR
                }
            } catch (error) {
                console.log(error)
                if (err.errorNotExist(error)) {
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
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
                if (authBL.isLoggedIn(userLoginKey)) {
                    if (await podcastDAL.userHasReviews(userLoginKey.user)) {
                        let reviews = await podcastDAL.getNReviewsByUser(userLoginKey.user, numberOfReviews)
                        reviews = await addPodcastInfoToReview(reviews)
                        return reviews
                    }
                    return []
                } else {
                    throw err.err.AUTH_USER_ERROR
                }
            } catch (error) {
                console.log(error)
                if (err.errorNotExist(error)) {
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
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

        getNReviewsByUser: async function getNReviewsByUser(userLoginKey, value) {

            const postPerPage = 3
            try {
                if (authBL.isLoggedIn(userLoginKey)) {
                    if (value == "all") {
                        if (await podcastDAL.userHasReviews(userLoginKey.user)) {
                            let reviews = await podcastDAL.getAllReviewsByUser(userLoginKey.user)
                            reviews = await addPodcastInfoToReview(reviews)
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
                        if (await podcastDAL.userHasReviews(userLoginKey.user)) {
                            let reviews = await podcastDAL.getNReviewsByUser(userLoginKey.user, value)
                            reviews = await addPodcastInfoToReview(reviews)
                            return { result: reviews, amount: value }
                        }
                        return []
                    }
                } else {
                    throw err.err.AUTH_USER_ERROR
                }
            } catch (error) {
                console.log(error)
                if (err.errorNotExist(error)) {
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
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


    async function addPodcastInfoToReview(reviews){
        try{
            for(review of reviews){
                const podInfo = await searchItunesBL.searchPodcast(review.pod_id)
                review.posterUrl = podInfo.results[0].artworkUrl600
            }
            return reviews
        } catch (error) {
            console.log(error)
            throw error
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
        const errorMessages = []

        if (overallRating <= 0 || overallRating > 5) {
            errorMessages.push(err.err.INVALID_OVERALL_RATING)
        }

        if (toneRating !== "comedy" && toneRating !== "drama") {
            errorMessages.push(err.err.INVALID_TONE_RATING)
        }

        if (topicRelevence <= 0 || topicRelevence > 5) {
            errorMessages.push(err.err.INVALID_TOPIC_RATING)
        }

        if (productionQuality <= 0 || productionQuality > 5) {
            errorMessages.push(err.err.INVALID_PRODUCTION_RATING)
        }

        if (errorMessages.length != 0) {
            throw errorMessages
        }
    }

    async function fetchPodInfo(url) {
        const html = await axios.get(url)
        const $ = cheerio.load(html.data)
        return $('.product-hero-desc').find('p').first().text()
    }

}

