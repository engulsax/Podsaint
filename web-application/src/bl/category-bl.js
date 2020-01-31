const categoryDAL = require('../dal/category-dal.js')

const errors = {
    'noCategories': 'Could not get categories. Try again later.',
}

exports.getCategoriesDetails = async function getCategoriesDetails() {
    if(categoryDAL.dataNotFetched()){
        await categoryDAL.fetchData()
    }
    return categoryDAL.categoriesDetails
}

exports.getCategories = async function getCategoriesDetails() {
    if(categoryDAL.dataNotFetched()){
        await categoryDAL.fetchData()
    }
    return categoryDAL.categoriesDetails.map(obj => obj.category)
}

exports.getCategoryDetails = async function getCategoryDetails(id) {
    if(categoryDAL.dataNotFetched()){
        await categoryDAL.fetchData()
    }
    return categoryDAL.categoriesDetails.find(obj => {return obj.id === id})
}