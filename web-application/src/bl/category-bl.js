const axios = require("axios")
const cheerio = require('cheerio')
const URL = "https://podcasts.apple.com/us/genre/podcasts/id26"
const categoriesDetails = []
const idRegex = /(?:\/id(\d+))/

const errors = {
    'noCategories': 'Could not get categories. Try again later.',
}

module.exports = function () {

    return {

        getCategoriesDetails: async function () {
            if (dataNotFetched()) {
                await fetchData()
            }
            return categoriesDetails
        },

        getCategories: async function () {
            if (dataNotFetched()) {
                await fetchData()
            }
            return categoriesDetails.map(obj => obj.category)
        },

        getCategoryDetails: async function (id) {
            if (dataNotFetched()) {
                await fetchData()
            }
            return categoriesDetails.find(obj => { return obj.id === id })
        }
    }
}


 async function fetchData() {
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
}

function dataNotFetched(){
    return(categoriesDetails.length === 0)
}