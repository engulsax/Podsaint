
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

			// TODO: Build an SDK (e.g. a separate JS file)
			// handling the communication with the backend.
			const response = await fetch(
				"http://192.168.99.100:3000/api/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
				body: "username=" + username + "&password=" + password + "&email=" + email
			})


			if(response.status == 201){	
				signIn(username, password, modalSignUp)
			} else {


				
				const error = document.getElementById("signup-error")
				error.innerText = response

			}

			console.log(response.status)


		} catch (error) {
			console.log(error)
		}

	}
})


/*

// TODO: Don't write all JS code in the same file.
document.addEventListener("DOMContentLoaded", function(){

	changeToPage(location.pathname)

	if(localStorage.accessToken){
		login(localStorage.accessToken)
	}else{
		logout()
	}

	document.body.addEventListener("click", function(event){
		if(event.target.tagName == "A"){
			event.preventDefault()
			const url = event.target.getAttribute("href")
			goToPage(url)
		}
	})

	// TODO: Avoid using this long lines of code.
	document.querySelector("#create-pet-page form").addEventListener("submit", function(event){
		event.preventDefault()

		const name = document.querySelector("#create-pet-page .name").value

		const pet = {
			name
		}

		// TODO: Build an SDK (e.g. a separate JS file)
		// handling the communication with the backend.
		fetch(
			"http://localhost:8080/pets", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+localStorage.accessToken
				},
				body: JSON.stringify(pet)
			}
		).then(function(response){
			// TODO: Check status code to see if it succeeded. Display errors if it failed.
			// TODO: Update the view somehow.
			console.log(response)
		}).catch(function(error){
			// TODO: Update the view and display error.
			console.log(error)
		})

	})

	document.querySelector("#login-page form").addEventListener("submit", function(event){
		event.preventDefault()

		const username = document.querySelector("#login-page .username").value
		const password = document.querySelector("#login-page .password").value

		fetch(
			"http://localhost:8080/tokens", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
				body: "grant_type=password&username="+username+"&password="+password
			}
			).then(function(response){
				// TODO: Check status code to see if it succeeded. Display errors if it failed.
				return response.json()
			}).then(function(body){
				// TODO: Read out information about the user account from the id_token.
				login(body.access_token)
				console.log(accessToken)
		}).catch(function(error){
			console.log(error)
		})

	})

})

function fetchAllPets(){

	fetch(
		"http://localhost:8080/pets"
	).then(function(response){
		// TODO: Check status code to see if it succeeded. Display errors if it failed.
		return response.json()
	}).then(function(pets){
		const ul = document.querySelector("#pets-page ul")
		ul.innerText = ""
		for(const pet of pets){
			const li = document.createElement("li")
			const anchor = document.createElement("a")
			anchor.innerText = pet.name
			anchor.setAttribute("href", '/pets/'+pet.id)
			li.appendChild(anchor)
			ul.append(li)
		}
	}).catch(function(error){
		console.log(error)
	})

}

function fetchPet(id){

	fetch(
		"http://localhost:8080/pets/"+id
	).then(function(response){
		// TODO: Check status code to see if it succeeded. Display errors if it failed.
		return response.json()
	}).then(function(pet){
		const nameSpan = document.querySelector("#pet-page .name")
		const idSpan = document.querySelector("#pet-page .id")
		nameSpan.innerText = pet.name
		idSpan.innerText = pet.id
	}).catch(function(error){
		console.log(error)
	})

}

function login(accessToken){
	localStorage.accessToken = accessToken
	document.body.classList.remove("isLoggedOut")
	document.body.classList.add("isLoggedIn")
}

function logout(){
	localStorage.accessToken = ""
	document.body.classList.remove("isLoggedIn")
	document.body.classList.add("isLoggedOut")
}*/