
const searchDAL = require('../dal/search-dal')

exports.searchPodcastsWithId = async function searchPodcasts(term, subCategoryId, mainCategoryId) {
    if (subCategoryId === "all") {
        return await searchDAL.getPodcastsWithId(term, mainCategoryId)
    }
    return await searchDAL.getPodcastsWithId(term, subCategoryId)
}

exports.searchPodcasts = async function searchPodcasts(term) {
    return await searchDAL.getPodcasts(term)
}