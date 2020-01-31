
//change node-fetch to axios
const fetch = require('node-fetch')
const defaultHTTPS = "https://itunes.apple.com/search?media=podcast&limit=200"

exports.getPodcasts = async function getPodcasts(term){
    //options = { "term": term, "country": country, "lang": lang }
    let https = defaultHTTPS + "&term=" + term
    try{
        const response = await fetch(https)
        console.log(await response.json())
    }
    catch(error){
       console.log("poop")
    }
}

//entity
/*podcastAuthor, podcast*/

//attribute
/*titleTerm, languageTerm, authorTerm, genreIndex, artistTerm, ratingIndex, keywordsTerm, descriptionTerm*/

//country
/*https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2*/

//genreId