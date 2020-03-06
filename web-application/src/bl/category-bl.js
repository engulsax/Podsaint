const axios = require("axios")
const cheerio = require('cheerio')
const err = require('../errors/error')
const URL = "https://podcasts.apple.com/us/genre/podcasts/id26"
let categoriesDetails = []
const idRegex = /(?:\/id(\d+))/
const fs = require('fs')
const fsPromises = fs.promises;


module.exports = function () {

    return {

        getCategoriesDetails: async function () {
            if (dataNotFetched()) {
                try {
                    await fetchData()
                } catch (error) {
                    console.log(error)
                    if(err.errorNotExist(error)){
                        error = err.err.INTERNAL_SERVER_ERROR
                    }
                    throw error
                }
            }
            return categoriesDetails
        },

        getCategories: async function () {
            if (dataNotFetched()) {
                try {
                    await fetchData()
                } catch (error) {
                    console.log(error)
                    if(err.errorNotExist(error)){
                        error = err.err.INTERNAL_SERVER_ERROR
                    }
                    throw error
                }
            }
            return categoriesDetails.map(obj => obj.category)
        },

        getCategoryDetails: async function (id) {
            if (dataNotFetched()) {
                try {
                    await fetchData()
                } catch (error) {
                    console.log(error)
                    if(err.errorNotExist(error)){
                        error = err.err.INTERNAL_SERVER_ERROR
                    }
                    throw error
                }
            }
            return categoriesDetails.find(obj => { return obj.id === id })
        }
    }
}


async function fetchData() {
    try {
        categoriesDetails = []
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
    } catch (error) {
        console.log(error)
        try {
            await readCategoriesFromFile()
        } catch (error) {
            console.log(error)
            throw err.err.CATEGORY_FETCH_ERROR
        }
    }
}

function dataNotFetched() {
    return (categoriesDetails.length === 0)
}

async function readCategoriesFromFile() {
    try {
        categoriesDetails = await JSON.parse(fsPromises.readFile('/web-application/src/json/categories.json'))
    } catch (error) {
        console.log(error)
        throw err.err.CATEGORY_FETCH_ERROR
    }
}

async function updateCategoriesInFile() {
    try {
        await fetchData()
        await fsPromises.writeFile('/web-application/src/json/categories.json', JSON.stringify(categoriesDetails))
    } catch (error) {
        console.log(error)
        throw (error)
    }
}
