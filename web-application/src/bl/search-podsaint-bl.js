const fetch = require('node-fetch')
const defaultHTTPS = "https://itunes.apple.com/search?media=podcast"
const ALL_POD_ID = '26'

module.exports = function ({ searchPodsaintDAL }) {

    return {
        getSearchMatch: async function (
            categoryId,
            searchTerm,
            toneRating,
            minTopicRelevence,
            minProductionQualty,
            minOverallRating
        ) {

            if(categoryId === 'all'){
                categoryId = ALL_POD_ID
            }

            const response = await searchPodsaintDAL.getPodcastWithNameOrCreator(searchTerm)

            const podcastAnswerList = []

            //console.log("RESPONSE " + JSON.stringify(response))

            for (result of response) {
                if (await checkIfToneIsOk(result.pod_id, toneRating)
                    && await checkIfMinRatingIsOk(result.pod_id, minTopicRelevence, minProductionQualty, minOverallRating)
                    && await checkIfCategoryIdIsOk(result.pod_id, categoryId)) {
                    const podcast = await getPodcast(result.pod_id)
                    podcastAnswerList.push(podcast.results[0])
                }
            }

            //console.log("ANSWER " + JSON.stringify(podcastAnswerList))

            return podcastAnswerList
        }
    }

    async function checkIfMinRatingIsOk(podId, minTopicRelevence, minProductionQualty, minOverallRating) {
        return (await searchPodsaintDAL.checkIfPodIsOverMinOverallRating(podId, minOverallRating)
            && await searchPodsaintDAL.checkIfPodIsOverMinTopicRelevenceRating(podId, minTopicRelevence)
            && await searchPodsaintDAL.checkIfPodIsOverMinProductionQualityRating(podId, minProductionQualty))
    }

    async function checkIfToneIsOk(podId, toneRating) {
        if (toneRating === "comedy" && searchPodsaintDAL.checkIfPodToneIsComedy(podId)) {
            return true
        }
        if (toneRating === "drama" && !searchPodsaintDAL.checkIfPodToneIsComedy(podId)) {
            return true
        }
        return false
    }

    async function checkIfCategoryIdIsOk(podId, categoryId) {

        let https = defaultHTTPS + "&term=" + podId
        const response = await fetch(https)
        const result = await response.json()
        console.log(JSON.stringify(result.results[0].genreId))
        for (category of result.results[0].genreIds) {
            if (category === categoryId) {
                return true
            }
        }
        return false
    }

    async function getPodcast(podId) {
        let https = defaultHTTPS + "&term=" + podId
        const response = await fetch(https)
        return await response.json()
    }

}