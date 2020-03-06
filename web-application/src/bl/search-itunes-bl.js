const fetch = require('node-fetch')
const err = require('../errors/error')
const defaultHTTPS = "https://itunes.apple.com/search?media=podcast"

module.exports = function () {

    return {

        searchPodcastsWithIdAndTerm: async function (term, subCategoryId, mainCategoryId) {
            try {
                if (subCategoryId === "all") {
                    return await searchPodcastsWithIdAndTerm(term, mainCategoryId)
                }
                return await searchPodcastsWithIdAndTerm(term, subCategoryId)
            } catch (error) {
                console.log(error)
                throw err.err.PODCAST_FETCH_ERROR
            }
        },

        searchPodcastsWithId: async function (id) {
            try {
                return await getPodcastsWithId(id)
            } catch (error) {
                console.log(error)
                throw err.err.PODCAST_FETCH_ERROR
            }
        },

        searchPodcasts: async function (term) {
            try {
                return await getPodcasts(term)
            } catch (error) {
                console.log(error)
                throw err.err.PODCAST_FETCH_ERROR
            }
        },

        searchPodcast: async function (term) {
            try {
                return await getPodcast(term)
            } catch (error) {
                console.log(error)
                throw err.err.PODCAST_FETCH_ERROR
            }
        }
    }

    async function getPodcasts(term) {

        const limit = "&limit=80"
        let https = defaultHTTPS + limit + "&term=" + term
        const response = await fetch(https)
        const responseJSON = await response.json()
        if (responseJSON.resultCount == 0) {
            throw err.err.PODCAST_FETCH_ERROR
        }
        return responseJSON

    }

    async function getPodcast(term) {

        let https = defaultHTTPS + "&term=" + term
        const response = await fetch(https)
        const responseJSON = await response.json()
        if (responseJSON.resultCount == 0) {
            throw err.err.PODCAST_FETCH_ERROR
        }
        return await responseJSON

    }

    async function searchPodcastsWithIdAndTerm(term, categoryId) {

        const limit = "&limit=80"
        let https = defaultHTTPS + limit + "&term=" + term + "&genreId=" + categoryId
        const response = await fetch(https)
        const responseJSON = await response.json()
        if (responseJSON.resultCount == 0) {
            throw err.err.PODCAST_FETCH_ERROR
        }
        return responseJSON

    }

    async function getPodcastsWithId(categoryId) {

        const limit = "&limit=20"
        let https = defaultHTTPS + limit + "&term=podcast" + "&genreId=" + categoryId
        const response = await fetch(https)
        const responseJSON = await response.json()
        if (responseJSON.resultCount == 0) {
            throw err.err.PODCAST_FETCH_ERROR
        }
        return responseJSON
    }
}
