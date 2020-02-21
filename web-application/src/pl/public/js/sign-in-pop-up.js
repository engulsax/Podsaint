document.addEventListener("DOMContentLoaded", function (event) {

    var modalSignIn = document.getElementById("sign-in-pop-up")

    var modalBtnSignIn = document.getElementById("sign-in")

    var closeBtn = document.getElementById("close-btn-sign-in")

    var altSignUpBtn = document.getElementById("sign-up-alternative")

    var modalSignUp = document.getElementById("sign-up-pop-up")
    
    const inputUsername = document.getElementById("signin-user")
    const inputPassword = document.getElementById("signin-password")

    modalBtnSignIn.addEventListener("click", function (event) {
        
        event.preventDefault()
        modalSignIn.style.display = "block"
    })

    altSignUpBtn.addEventListener("click",function(event){
        modalSignIn.style.display = "none"
        modalSignUp.style.display = "block"
    })



    window.addEventListener("click", function (event) {
        
        if (event.target === modalSignIn) {
            modalSignIn.style.display = "none"
        }
    })

    closeBtn.addEventListener("click", function (event) {
        modalSignIn.style.display = "none"
    })

    document.getElementById("sign-in-btn").addEventListener("click", function(event){
    
        console.log("submit user sign in")
        const username = inputUsername.value
        const password = inputPassword.value
        
        if(username.length == 0 || username.length > 15){
            document.getElementById("input-user-error").innerText = "enter a valid username"
            event.preventDefault()
        }
        if(password.length == 0 || password.length > 40){
            document.getElementById("input-password-error").innerText = "enter a valid password"
            event.preventDefault()
        }
    })

})