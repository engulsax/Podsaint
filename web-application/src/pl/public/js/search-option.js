document.addEventListener("DOMContentLoaded", function (event) {

   
    const itunesSection = document.getElementById("itunes-search")

    const podsaintSection = document.getElementById("podsaint-search")
    
    const itunesButton = document.getElementById("itunes-search-button")
    
    const podsaintButton = document.getElementById("podsaint-search-button")

    const buttonholder = document.getElementById("choose-search")

    buttonholder.style.display = "block"

    itunesSection.style.display = "none"

    //podsaint section selected first
    podsaintButton.style.backgroundColor = "rgb(123, 158, 108)"
    podsaintSection.style.display = "block"

    itunesButton.addEventListener("click", function (event) {
        itunesSection.style.display = "block"
        podsaintSection.style.display = "none"
        itunesButton.style.backgroundColor = "rgb(123, 158, 108)"
        podsaintButton.style.backgroundColor = "rgb(152,189,139)"
    })

    podsaintButton.addEventListener("click", function (event) {
        podsaintSection.style.display = "block"
        itunesSection.style.display = "none"
        podsaintButton.style.backgroundColor = "rgb(123, 158, 108)"
        itunesButton.style.backgroundColor = "rgb(152,189,139)"
    })

})