const express = require('express')
const categoryBL = require('../../bl/category-bl')
const searchBL = require('../../bl/search-bl')
const router = express.Router()


router.get('/:id', function (request, response) {
    (async function () {

        const collectionId = request.params.id
        const information = await searchBL.searchPodcast(collectionId)
        const categories = await categoryBL.getCategoriesDetails(),
        model = {
            collectionId: collectionId,
            information: information.results,
            categories: categories
        }
        response.render("podcast.hbs", { model })
    })()
})

router.get('/:id/write-review', function (request, response) {
    (async function () {
        model = {
            categories: await categoryBL.getCategoriesDetails()
        }
        response.render("write-review.hbs", { model })
    })()
})

module.exports = router