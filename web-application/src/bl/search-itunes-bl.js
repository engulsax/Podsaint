const fetch = require('node-fetch')
const defaultHTTPS = "https://itunes.apple.com/search?media=podcast"

module.exports = function () {

    return {

        searchPodcastsWithIdAndTerm: async function (term, subCategoryId, mainCategoryId) {
            if (subCategoryId === "all") {
                return await searchPodcastsWithIdAndTerm(term, mainCategoryId)
            }
            return await searchPodcastsWithIdAndTerm(term, subCategoryId)
        },

        searchPodcastsWithId: async function (id) {
            return await getPodcastsWithId(id)
        },

        searchPodcasts: async function (term) {
            return await getPodcasts(term)
        },

        searchPodcast: async function (term) {
            return await getPodcast(term)
        }
    }
}

async function getPodcasts(term){
    const limit = "&limit=80"
    let https = defaultHTTPS +limit+ "&term=" + term
    console.log(https)
    const response = await fetch(https)
    return await response.json()
}

async function getPodcast(term){
    let https = defaultHTTPS + "&term=" + term
    console.log(https)
    const response = await fetch(https)
    return await response.json()
}

async function searchPodcastsWithIdAndTerm(term, categoryId){
    const limit = "&limit=80"
    let https = defaultHTTPS + limit + "&term=" + term + "&genreId=" + categoryId
    console.log(https)
    const response = await fetch(https)
    return await response.json()
}

async function getPodcastsWithId (categoryId){
    const limit = "&limit=20"
    let https = defaultHTTPS + limit + "&term=podcast" + "&genreId=" + categoryId
    console.log(https)
    const response = await fetch(https)
    return await response.json()
}