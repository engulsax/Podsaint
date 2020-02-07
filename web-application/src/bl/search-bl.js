
const searchDAL = require('../dal/search-dal')

exports.searchPodcastsWithIdAndTerm = async function searchPodcastsWithIdAndTerm(term, subCategoryId, mainCategoryId) {
    if (subCategoryId === "all") {
        return await searchDAL.searchPodcastsWithIdAndTerm(term, mainCategoryId)
    }
    return await searchDAL.searchPodcastsWithIdAndTerm(term, subCategoryId)
}

exports.searchPodcastsWithId = async function getPodcastsWithId(id) {
    return await searchDAL.getPodcastsWithId(id)
}

exports.searchPodcasts = async function searchPodcasts(term) {
    return await searchDAL.getPodcasts(term)
}

exports.searchPodcast = async function searchPodcast(term) {
    return await searchDAL.getPodcast(term)
}