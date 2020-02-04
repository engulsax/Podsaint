
//change node-fetch to axios
const fetch = require('node-fetch')
const defaultHTTPS = "https://itunes.apple.com/search?media=podcast&limit=50"

exports.getPodcasts = async function getPodcasts(term){
    let https = defaultHTTPS + "&term=" + term
    console.log(https)
    const response = await fetch(https)
    return await response.json()
}


exports.getPodcastsWithId = async function getPodcastsWithId(term, categoryId){
    let https = defaultHTTPS + "&term=" + term + "&genreId=" + categoryId
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