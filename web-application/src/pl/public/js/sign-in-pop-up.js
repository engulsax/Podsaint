document.addEventListener("DOMContentLoaded", function (event) {

    //Get modal element
    var modalSignIn = document.getElementById("sign-in-pop-up")
    //Get modal button
    var modalBtnSignIn = document.getElementById("sign-in")
    //Get close button
    var closeBtn = document.getElementById("close-btn")

    modalBtnSignIn.addEventListener("click", function (event) {
        modalSignIn.style.display = "block"
    })

    window.addEventListener("click", function (event) {
        if (event.target === modalSignIn) {
            modalSignIn.style.display = "none"
        }
    })

    closeBtn.addEventListener("click", function (event) {
        modalSignIn.style.display = "none"
    })

})