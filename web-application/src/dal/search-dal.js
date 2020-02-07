
//change node-fetch to axios
const fetch = require('node-fetch')
const defaultHTTPS = "https://itunes.apple.com/search?media=podcast"

exports.getPodcasts = async function getPodcasts(term){
    const limit = "&limit=80"
    let https = defaultHTTPS +limit+ "&term=" + term
    console.log(https)
    const response = await fetch(https)
    return await response.json()
}

exports.getPodcast = async function getPodcast(term){
    let https = defaultHTTPS + "&term=" + term
    console.log(https)
    const response = await fetch(https)
    return await response.json()
}

exports.searchPodcastsWithIdAndTerm = async function searchPodcastsWithIdAndTerm(term, categoryId){
    const limit = "&limit=80"
    let https = defaultHTTPS + limit + "&term=" + term + "&genreId=" + categoryId
    console.log(https)
    const response = await fetch(https)
    return await response.json()
}

exports.getPodcastsWithId = async function getPodcastsWithId(categoryId){
    const limit = "&limit=20"
    let https = defaultHTTPS + limit + "&term=podcast" + "&genreId=" + categoryId
    console.log(https)
    const response = await fetch(https)
    return await response.json()
}


//entity
/*podcastAuthor, podcast*/

//attribute
/*titleTerm, languageTerm, authorTerm, genreIndex, artistTerm, ratingIndex, keywordsTerm, descriptionTerm*/

//country
/*https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2*/

//genreId