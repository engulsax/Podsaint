document.addEventListener("DOMContentLoaded", function (event) {

    //Get modal sign up
    var modalSignUp = document.getElementById("sign-up-pop-up")
    //Get modal button
    var modalBtnSignUp = document.getElementById("sign-up")
    //Get close button
    var closeBtn = document.getElementById("close-btn-sign-up")
    //Alt sign in
    var altSignInBtn = document.getElementById("sign-in-alternative")
    //Get modal sign in
    var modalSignIn = document.getElementById("sign-in-pop-up")

    modalBtnSignUp.addEventListener("click", function (event) {
        modalSignUp.style.display = "block"
    })

    window.addEventListener("click", function (event) {
        if (event.target === modalSignUp) {
            modalSignUp.style.display = "none"
        }
    })

    closeBtn.addEventListener("click", function (event) {
        modalSignUp.style.display = "none"
    })

    altSignInBtn.addEventListener("click",function(event){
        modalSignUp.style.display = "none"
        modalSignIn.style.display = "block"
    })
})