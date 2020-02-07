const express = require('express')
const categoryBL = require('../../bl/category-bl')
const searchBL = require('../../bl/search-bl')
const router = express.Router()


router.get('/:id', function (request, response) {
    (async function () {

        const collectionId = request.params.id
        const informationRespons = await searchBL.searchPodcast(collectionId)
        const information = informationRespons.results
        const mainCategoryId = information[0].genreIds[0]
        const podcastsInSameCategory = await searchBL.searchPodcastsWithId(mainCategoryId)
        const description = await categoryBL.fetchPodInfo(information[0].collectionViewUrl)



        model = {
            categories: await categoryBL.getCategoriesDetails(),
            collectionId: collectionId,
            information: information,
            podcastsInSameCategory: podcastsInSameCategory.results,
            description: description
        }

        response.render("podcast.hbs", { model })
    })()
})

router.get('/:id/write-review', function (request, response) {
    (async function () {

        const collectionId = request.params.id
        const informationRespons = await searchBL.searchPodcast(collectionId)
        const information = informationRespons.results
        const mainCategoryId = information[0].genreIds[0]
        const podcastsInSameCategory = await searchBL.searchPodcastsWithId(mainCategoryId)
        const description = await categoryBL.fetchPodInfo(information[0].collectionViewUrl)

        model = {
            categories: await categoryBL.getCategoriesDetails(),
            collectionId: collectionId,
            information: information,
            podcastsInSameCategory: podcastsInSameCategory.results,
            description: description
        }

        response.render("write-review.hbs", { model })
    })()
})

module.exports = router