document.addEventListener("DOMContentLoaded", function (event) {

    var modalSignUp = document.getElementById("sign-up-pop-up")

    var modalBtnSignUp = document.getElementById("sign-up")

    var closeBtn = document.getElementById("close-btn-sign-up")

    var altSignInBtn = document.getElementById("sign-in-alternative")

    var modalSignIn = document.getElementById("sign-in-pop-up")

    const inputUsername = document.getElementById("input-username")

    const inputUserEmail = document.getElementById("input-email")

    const inputPassword = document.getElementById("input-password")


    modalBtnSignUp.addEventListener("click", function (event) {
        event.preventDefault()
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


    document.getElementById("sign-up-btn").addEventListener("click", function(event){

    console.log("submit user reg")
    
    const username = inputUsername.value
    const password = inputPassword.value
    const email = inputUserEmail.value
    const usernameError = document.getElementById("username-error")
    const passwordError = document.getElementById("password-error")
    const emailError = document.getElementById("email-error")
    emailError.style.display = "none"
    passwordError.style.display = "none"
    usernameError.style.display = "none"
    
    if(username.length < 4 || username.length > 15){
        usernameError.innerText= "username error"
        usernameError.style.display ="block"
        event.preventDefault()
    }
    if(password.length < 5 || password.length > 30){
        passwordError.innerText = "password error"
        passwordError.style.display = "block"
        event.preventDefault()
    }
    if(!email.includes('@') || email.length < 8 || email.length > 40){
        emailError.innerText = "email error"
        emailError.style.display = "block"
        event.preventDefault()
    }
   })
})