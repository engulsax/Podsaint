


module.exports = function({}){

    const axios = require("axios")
    const cheerio = require('cheerio')
    const URL = "https://podcasts.apple.com/us/genre/podcasts/id26"
    const categoriesDetails = []
    const idRegex = /(?:\/id(\d+))/
  
    return{

        fetchData: async function() {
            const html = await axios.get(URL)
            const $ = cheerio.load(html.data)
            $('.column', '#genre-nav').each(function (i, elem) {
                $(elem).children().each(function (i, child) {
        
                    let category = $(child).find('.top-level-genre').text()
        
                    /*Getting href link where the id is present, accesing id with regex.
                    For some reason the non-capturing group does not remove the full match, 
                    so i need to take second index*/
                    let id = $(child).find('.top-level-genre').attr('href').match(idRegex)[1]
        
                    let subCategories = []
                    $(child).find('.top-level-subgenres').children('li').each(function (i, listElem) {
                        let subCategory = $(listElem).text()
                        let subId = $(listElem).find('a').attr('href').match(idRegex)[1]
                        subCategories.push({ 'category': subCategory, 'id': subId })
                    })
                    categoriesDetails.push({ 'category': category, 'id': id, 'subCategories': subCategories })
                })
            })
        },
        
        fetchPodInfo: async function fetchInfo(url) {
            const html = await axios.get(url)
            const $ = cheerio.load(html.data)
            return $('.product-hero-desc').find('p').first().text()
        },
        
        
        dataNotFetched: function(){
            return(categoriesDetails.length === 0)
        },
        
        categoriesDetails
        
    }
}
