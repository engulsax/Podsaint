

module.exports = function ({ searchDAL }) {

    return {

        searchPodcastsWithIdAndTerm: async function (term, subCategoryId, mainCategoryId) {
            if (subCategoryId === "all") {
                return await searchDAL.searchPodcastsWithIdAndTerm(term, mainCategoryId)
            }
            return await searchDAL.searchPodcastsWithIdAndTerm(term, subCategoryId)
        },

        searchPodcastsWithId: async function (id) {
            return await searchDAL.getPodcastsWithId(id)
        },

        searchPodcasts: async function (term) {
            return await searchDAL.getPodcasts(term)
        },

        searchPodcast: async function (term) {
            return await searchDAL.getPodcast(term)
        }
    }
}
