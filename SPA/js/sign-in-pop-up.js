document.addEventListener("DOMContentLoaded", function (event) {

    const modalSignIn = document.getElementById("sign-in-pop-up")

    const modalBtnSignIn = document.getElementById("sign-in")

    const closeBtn = document.getElementById("close-btn-sign-in")

    const altSignUpBtn = document.getElementById("sign-up-alternative")

    const modalSignUp = document.getElementById("sign-up-pop-up")

    const loaderSection = document.getElementById("loader")

    const inputUsername = document.getElementById("signin-user")
    const inputPassword = document.getElementById("signin-password")

    const signOutBtn = document.getElementById("sign-out")

    modalBtnSignIn.addEventListener("click", function (event) {
        event.preventDefault()
        modalSignIn.style.display = "block"
    })

    altSignUpBtn.addEventListener("click", function (event) {
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

    document.getElementById("sign-in-btn").addEventListener("click", async function (event) {

        event.preventDefault()

        console.log("submit user sign in")
        const username = inputUsername.value
        const password = inputPassword.value
        
        loaderSection.classList.add("lds-hourglass")

        await signIn(username, password, modalSignIn)
        
        loaderSection.classList.remove("lds-hourglass")

    })

    signOutBtn.addEventListener("click", function(event){
        event.preventDefault()

        signOut()

    })
})

export async function signIn(username, password, modal) {

    modal.style.display = "none"

    try {

        const response = await fetch(
            "http://192.168.99.100:3000/api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: encodeURI("grant_type=password&username=" + username + "&password=" + password)
        })
        
        const token = await response.json()

        if(response.status == 200){

            localStorage.accessToken = token    
            console.log(token)    
            document.body.classList.remove("signed-out")
            document.body.classList.add("signed-in")
            

        } else {
            modal.style.display = "block"
            const error = document.getElementById("signin-error")
			error.innerText = body
        }   

    } catch (error) {
        console.log(error)
    }
}

export function signOut(){

    localStorage.accessToken = ""
    document.body.classList.remove("signed-in")
    document.body.classList.add("signed-out")

}
