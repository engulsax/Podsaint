document.addEventListener("DOMContentLoaded", function (event) {

    //add to list link from podcast-information
    var modalBtnAddToList = document.getElementById("add-to-list")
    //add to list div
    var modalAddToList = document.getElementById("add-to-list-pop-up")
    
    var closeBtn = document.getElementById("close-btn-add-to-list")

 
    modalBtnAddToList.addEventListener("click", function (event) {
        console.log("här din bajs")
        event.preventDefault()
        
        modalAddToList.style.display = "block"
    })


    window.addEventListener("click", function (event) {
        
        if (event.target === modalAddToList) {
            modalAddToList.style.display = "none"
        }
    })

    closeBtn.addEventListener("click", function (event) {
        modalAddToList.style.display = "none"
    })
})