
import { populatePodcastInformation } from './podcast-information.js'
import { getUserPlaylists } from './account.js'
import { getPlaylistInEditMode } from './edit-list.js'

const ACCOUNT_PAGE = "account-page"
const HOME_PAGE = "home-page"
const SEARCH_PAGE = "search-page"
const PODCAST_PAGE = "podcast-page"
const ERROR_PAGE = "error-page"
const EDIT_LIST_PAGE = "edit-list-page"

const pages = {
    "/account": ACCOUNT_PAGE, "/home": HOME_PAGE, "/search": SEARCH_PAGE,
    "/podcast": PODCAST_PAGE, "/edit": EDIT_LIST_PAGE
}


document.addEventListener("DOMContentLoaded", function (event) {

    if (localStorage.accessToken) {
        document.body.classList.remove("signed-out")
        document.body.classList.add("signed-in")
    } else {
        document.body.classList.remove("signed-in")
        document.body.classList.add("signed-out")
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

            let url = ""
            if (target == "A") {
                url = event.target.getAttribute("href")
            } else {
                url = event.target.parentNode.getAttribute("href")
            }

            if (url == '#') {
                return
            }

            goToPage(url)
        }
    })
})


export function goToPage(url) {

    changeToPage(url)
    history.pushState({}, "", url)

}

async function changeToPage(url) {

    let currentPageSection = document.getElementsByClassName("current-page")[0]
    if (currentPageSection) {
        currentPageSection.classList.remove("current-page")
    }

    for (const [urlKey, pageValue] of Object.entries(pages)) {

        if (url == urlKey || new RegExp(`^${urlKey}\\/[\\w\\s]+$`).test(url)) { 

            await doPageAction(pageValue, url)

            return

        }
    }
}



async function doPageAction(pageValue, url) {
    const loaderSection = document.getElementById("loader")
    switch (pageValue) {

        case ACCOUNT_PAGE:
            loaderSection.classList.add("lds-hourglass")
            await getUserPlaylists()
            loaderSection.classList.remove("lds-hourglass")
            document.getElementById(pageValue).classList.add("current-page")
            break

        case HOME_PAGE:
            if (localStorage.accessToken) {
                loaderSection.classList.add("lds-hourglass")
                await getUserPlaylists()
                loaderSection.classList.remove("lds-hourglass")
                document.getElementById(ACCOUNT_PAGE).classList.add("current-page")
                return
            }
            break

        case SEARCH_PAGE:
            break

        case PODCAST_PAGE:
            loaderSection.classList.add("lds-hourglass")
            await populatePodcastInformation(url)
            loaderSection.classList.remove("lds-hourglass")
            break

        case EDIT_LIST_PAGE:
            loaderSection.classList.add("lds-hourglass")
            await getPlaylistInEditMode(url)
            loaderSection.classList.remove("lds-hourglass")
            break

        default:
            //ERROR
            document.getElementById(ERROR_PAGE).classList.add("current-page")
            return
    }
    document.getElementById(pageValue).classList.add("current-page")
}
