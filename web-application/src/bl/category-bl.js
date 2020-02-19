
module.exports = function({categoryDAL}){

    const errors = {
        'noCategories': 'Could not get categories. Try again later.',
    }

    return{

        getCategoriesDetails: async function() {
            if (categoryDAL.dataNotFetched()) {
                await categoryDAL.fetchData()
            }
            return categoryDAL.categoriesDetails
        },
        
        getCategories: async function() {
            if (categoryDAL.dataNotFetched()) {
                await categoryDAL.fetchData()
            }
            return categoryDAL.categoriesDetails.map(obj => obj.category)
        },
        
        getCategoryDetails: async function(id) {
            if (categoryDAL.dataNotFetched()) {
                await categoryDAL.fetchData()
            }
            return categoryDAL.categoriesDetails.find(obj => { return obj.id === id })
        },
        
        fetchPodInfo: async function(url) {
            return categoryDAL.fetchPodInfo(url)
        }
    }
}
