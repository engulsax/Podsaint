const express = require('express')
const categoryBL = require('../bl/category-bl')
const router = express.Router()

/*THIS IS REPETION OF CODE (SEE SAME CODE IN app.js), TODO: REMOVE AND MAKE BETTER*/
const model = {}

const getCategories = async function (request, response, next) {
    model.categories = await categoryBL.getCategoriesDetails()
    //console.log(await categoryBL.getCategoryDetails('1301'))
    next()
}

router.use(getCategories)

router.get('/:id', function (request, response) {
    (async function(){
        const id = request.params.id
        const currentCategoryDetails = await categoryBL.getCategoryDetails(id)
        model.category = currentCategoryDetails.category
        model.subCategories = currentCategoryDetails.subCategories
        console.log(model.subCategories)
        response.render('category.hbs', {model})
    })()
})

module.exports = router