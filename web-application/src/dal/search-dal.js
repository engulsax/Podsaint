

module.exports = function({}){
    
    //change node-fetch to axios
    const fetch = require('node-fetch')
    const defaultHTTPS = "https://itunes.apple.com/search?media=podcast"

    return{

        getPodcasts: async function(term){
            const limit = "&limit=80"
            let https = defaultHTTPS +limit+ "&term=" + term
            console.log(https)
            const response = await fetch(https)
            return await response.json()
        },
        
        getPodcast: async function(term){
            let https = defaultHTTPS + "&term=" + term
            console.log(https)
            const response = await fetch(https)
            return await response.json()
        },
        
        searchPodcastsWithIdAndTerm: async function(term, categoryId){
            const limit = "&limit=80"
            let https = defaultHTTPS + limit + "&term=" + term + "&genreId=" + categoryId
            console.log(https)
            const response = await fetch(https)
            return await response.json()
        },
        
        getPodcastsWithId: async function(categoryId){
            const limit = "&limit=20"
            let https = defaultHTTPS + limit + "&term=podcast" + "&genreId=" + categoryId
            console.log(https)
            const response = await fetch(https)
            return await response.json()
        }
    }
}


//entity
/*podcastAuthor, podcast*/

//attribute
/*titleTerm, languageTerm, authorTerm, genreIndex, artistTerm, ratingIndex, keywordsTerm, descriptionTerm*/

//country
/*https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2*/

//genreId