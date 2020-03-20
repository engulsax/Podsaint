document.addEventListener("DOMContentLoaded", function (event) {

    const modalAddToList = document.getElementById("list-pop-up")
    const formAddToList = document.getElementById("add-to-list")
    const btnShowAddToList = document.getElementById("show-add-to-list")

    formAddToList.addEventListener("submit", async function(event){
        event.preventDefault()
        modalAddToList.style.display = "none"
        const optionList = document.getElementById("podcast-lists")
        const playlistId = optionList.options[optionList.selectedIndex].value
        await addPodcastToList(playlistId)

    })

    btnShowAddToList.addEventListener("click", async function (event) {
        event.preventDefault()


        await getLitsOptions()


        modalAddToList.style.display = "block"
    })

    window.addEventListener("click", function (event) {

        if (event.target === modalAddToList) {
            modalAddToList.style.display = "none"
        }
    })

    document.getElementById("close-btn-add-to-list").addEventListener("click", function (event) {
        modalAddToList.style.display = "none"
    })
})


async function getLitsOptions() {


    const response = await fetch(
        "http://192.168.99.100:3000/api/playlistnames", {
        headers: {
            "Authorization": "Bearer " + localStorage.accessToken
        }
    })

    if (response.status == 200) {

        const playlists = await response.json()

        const optionList = document.getElementById("podcast-lists")
        optionList.innerText = ""

        for (const playlist of playlists) {  

            const option = document.createElement("option")
            option.value = playlist.id
            option.innerText = playlist.playlist_name

            optionList.appendChild(option)
        }

    } else {
        //HANDLE ERROR HERE
    }

}

async function addPodcastToList(playlistId){


    const url = window.location.href
    const podcastId = url.match(new RegExp("(?:podcast\/)([0-9]+)"))[1]
    const title = document.getElementById("title").innerText
    const creator = document.getElementById("creator").innerText

    const podcast ={
        playlistId,
        title,
        creator
    }

    const response = await fetch(
        "http://192.168.99.100:3000/api/" + podcastId + "/add-to-playlist", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.accessToken,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(podcast)
    })

    if(response.status == 201){
        //Display success message
    } else {   
        //error
    }
}