document.addEventListener("DOMContentLoaded", function (event) {

    const upArrow = '▲'
    const downArrow = '▼'
    //Get modal element
    var modalCategories = document.getElementById("categories-content")
    //Get modal button
    var categoriesBtn = document.getElementById("categories-button")

    categoriesBtn.textContent = "Categories " + downArrow

    categoriesBtn.addEventListener("click", function (event) {
        if (modalCategories.style.display === "none" || modalCategories.style.display === "") {
            modalCategories.style.display = "block"
            categoriesBtn.textContent = "Categories " + upArrow
        } else {
            modalCategories.style.display = "none"
            categoriesBtn.textContent = "Categories " + downArrow
        }
    })

})