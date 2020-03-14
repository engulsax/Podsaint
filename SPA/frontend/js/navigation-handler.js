
import { populatePodcastInformation } from './podcast-information.js'
import { getUserPlaylists } from './account.js'

document.addEventListener("DOMContentLoaded", function (event) {

    const loaderSection = document.getElementById("loader")

    if (localStorage.accessToken) {
        document.body.classList.remove("signed-out")
        document.body.classList.add("signed-in")
    } else {
        document.body.classList.remove("signed-in")
        document.body.classList.add("signed-out")
    }

    const ACCOUNT_PAGE = "account-page"
    const HOME_PAGE = "home-page"
    const SEARCH_PAGE = "search-page"
    const PODCAST_PAGE = "podcast-page"

    const pages = {
        "/account": ACCOUNT_PAGE, "/home": HOME_PAGE, "/search": SEARCH_PAGE,
        "/podcast": PODCAST_PAGE
    }


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

               await doPageAction(pageValue, id)
                
            }
        }

    }

    async function doPageAction(pageValue, id) {
        switch (pageValue) {

            case ACCOUNT_PAGE:
                loaderSection.classList.add("lds-hourglass")
                getUserPlaylists()
                loaderSection.classList.remove("lds-hourglass")
                document.getElementById(pageValue).classList.add("current-page")
                break

            case HOME_PAGE:
                if (localStorage.accessToken) {
                    loaderSection.classList.add("lds-hourglass")
                    getUserPlaylists()
                    loaderSection.classList.remove("lds-hourglass")
                    document.getElementById(ACCOUNT_PAGE).classList.add("current-page")
                    return
                }
                break

            case SEARCH_PAGE:
                break

            case PODCAST_PAGE:
                loaderSection.classList.add("lds-hourglass")
                await populatePodcastInformation(id)
                loaderSection.classList.remove("lds-hourglass")
                break
        }

        document.getElementById(pageValue).classList.add("current-page")
    }


})
