
import { populatePodcastInformation } from './podcast-information.js'

document.addEventListener("DOMContentLoaded", function (event) {

    console.log(localStorage.accessToken)


    if(localStorage.accessToken){
		document.body.classList.remove("signed-out")
        document.body.classList.add("signed-in")
	}else{
		document.body.classList.remove("signed-in")
        document.body.classList.add("signed-out")
	}

    //Use function
    const pages = {
        "/account": "account-page", "/home": "home-page", "/search": "search-page",
        "/podcast": "podcast-page"
    }

    const loaderSection = document.getElementById("loader")

    window.addEventListener("popstate", function (event) {
        let url = location.pathname
        changeToPage(url)
    })

    document.body.addEventListener("click", function (event) {

        const target = event.target.tagName
        console.log(target)
        if (target == "A" || target == "IMG") {
            event.preventDefault()

            let id = ""
            let url = ""
            if (target == "A") {
                url = event.target.getAttribute("href")
            } else {
                url = event.target.parentNode.getAttribute("href")
                id = url.split("/")[2]
            }

            console.log("URL   " + url)

            if (url == '/signin' || url == '/signup') {
                return
            }

            goToPage(url, id)
        }
    })

    function goToPage(url, id) {

        changeToPage(url, id)
        history.pushState({}, "", url)

    }

    async function changeToPage(url, id) {

        let currentPageSection = document.getElementsByClassName("current-page")[0]
        if (currentPageSection) {
            currentPageSection.classList.remove("current-page")
        }

        for (const [urlKey, pageValue] of Object.entries(pages)) {
            if (url == urlKey || new RegExp(`^${urlKey}/[0-9]+$`).test(url)) {
                if (id != "") {
                    loaderSection.classList.add("lds-hourglass")
                    await populatePodcastInformation(id)
                    loaderSection.classList.remove("lds-hourglass")
                }
                document.getElementById(pageValue).classList.add("current-page")
            }
        }

    }


})
