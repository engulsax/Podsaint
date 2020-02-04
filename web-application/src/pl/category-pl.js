const express = require('express')
const categoryBL = require('../bl/category-bl')
const router = express.Router()

/*THIS IS REPETION OF CODE (SEE SAME CODE IN app.js), TODO: REMOVE AND MAKE BETTER*/
const model = {}

const getCategories = async function (request, response, next) {
    model.categories = await categoryBL.getCategoriesDetails()
    next()
}

router.use(getCategories)

router.get('/:id', function (request, response) {
    (async function(){
        const id = request.params.id
        const currentCategoryDetails = await categoryBL.getCategoryDetails(id)
        model.category = currentCategoryDetails.category
        model.id = currentCategoryDetails.id
        model.subCategories = currentCategoryDetails.subCategories
        response.render('category.hbs', {model})
    })()
})

module.exports = router