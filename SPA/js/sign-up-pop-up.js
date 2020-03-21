
import  {signIn} from './sign-in-pop-up.js'

document.addEventListener("DOMContentLoaded", function (event) {

	const modalSignUp = document.getElementById("sign-up-pop-up")

	const modalBtnSignUp = document.getElementById("sign-up")

	const closeBtn = document.getElementById("close-btn-sign-up")

	const altSignInBtn = document.getElementById("sign-in-alternative")

	const modalSignIn = document.getElementById("sign-in-pop-up")

	const inputUsername = document.getElementById("input-username")

	const inputUserEmail = document.getElementById("input-email")

	const inputPassword = document.getElementById("input-password")

	const loaderSection = document.getElementById("loader")


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

	altSignInBtn.addEventListener("click", function (event) {
		modalSignUp.style.display = "none"
		modalSignIn.style.display = "block"
	})


	document.getElementById("sign-up-btn").addEventListener("click", async function (event) {

		event.preventDefault()

		const username = inputUsername.value
		const password = inputPassword.value
		const email = inputUserEmail.value
		const usernameError = document.getElementById("username-error")
		const passwordError = document.getElementById("password-error")
		const emailError = document.getElementById("email-error")

		emailError.style.display = "none"
		passwordError.style.display = "none"
		usernameError.style.display = "none"

		if (username.length == 0 || username.length > 15) {
			usernameError.innerText = "Enter a valid username (max length 15 characters)"
			usernameError.style.display = "block"
			return
		}
		if (password.length < 8 || password.length > 30) {
			passwordError.innerText = "Enter a valid password (between 8 and 30 characters)"
			passwordError.style.display = "block"
			return
		}
		if (!email.includes('@') || email.length < 8 || email.length > 40) {
			emailError.innerText = "Enter a valid email (max length 40 characters)"
			emailError.style.display = "block"
			return
		}

		loaderSection.classList.add("lds-hourglass")

		await signUp(username, password, email)

		loaderSection.classList.remove("lds-hourglass")

	})


	async function signUp(username, password, email) {

		try {

			modalSignUp.style.display = "none"

			const error = document.getElementById("signup-error")
			error.innerText = ""

			const response = await fetch(
				"http://192.168.99.100:3000/api/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: encodeURI("username=" + username + "&password=" + password + "&email=" + email)
			})

			if(response.status == 201){	
				signIn(username, password, modalSignUp)
			} else {	
				const error = document.getElementById("signup-error")
				error.innerText = response
			}

		} catch (error) {
			console.log(error)
		}

	}
})