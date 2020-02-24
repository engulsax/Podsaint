document.addEventListener("DOMContentLoaded", function (event) {

    var modalAddToList = document.getElementById("list-pop-up")
    var modalBtnAddToList = document.getElementById("add-to-list")
    //var closeBtn = document.getElementById("close-btn-add-to-list")
    //var createNewListLink = document.getElementById("create-new-list-link")
    var modalCreateList = document.getElementById("create-new-list")
    //var createNewListBtn = document.getElementById("create-new-list-btn")
 
    modalBtnAddToList.addEventListener("click", function (event) {
        event.preventDefault()
        modalAddToList.style.display = "block"
    })

    window.addEventListener("click", function (event) {
        
        if (event.target === modalAddToList) {
            modalAddToList.style.display = "none"
        }
    })

    document.getElementById("close-btn-add-to-list").addEventListener("click", function (event) {
        modalAddToList.style.display = "none"
    })

    document.getElementById("create-new-list-link").addEventListener("click", function (event){
        
        if(modalCreateList.style.display == "block"){
            modalCreateList.style.display ="none"
        }
        else{
            modalCreateList.style.display = "block"
        }
        
    })
    document.getElementById("create-new-list-btn").addEventListener("click", function(event){
        var listName = document.getElementById("input-listname").value
       
        if(listName.length < 4 || listName.length > 40){
            event.preventDefault()
            document.getElementById("list-input-error").innerText = "Enter a valid playlist name"
        }
    })
})