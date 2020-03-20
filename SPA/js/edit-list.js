import { goToPage } from './navigation-handler.js'

export async function getPlaylistInEditMode(url) {
    
    const id = url.split("/")[2]

    const response = await fetch(
        "http://192.168.99.100:3000/api/edit/" + id, {
        headers: {
            "Authorization": "Bearer " + localStorage.accessToken
        }
    })

    const playlist = await response.json()


    if (response.status == 200) {

        if (playlist.length == 0) {
            document.getElementById("no-lists").innerText = "You have no podcasts in list"
            return
        }

        const form = document.getElementById("remove-podcast")
        form.innerText = ""

        const mainSection = document.createElement("section")
        mainSection.id = "my-podcast-list"


        const div2 = document.createElement("div")
        div2.className = "cell small-11"


        const h2 = document.createElement("h2")
        h2.className = "sub-text no-margin center"
        h2.innerText = playlist.playlistName

        const ul2 = document.createElement("ul")
        ul2.id = "podcast-section"

        for (const podcast of playlist.podcasts) {

            const li2 = document.createElement("li")

            const input1 = document.createElement("input")
            input1.type = "checkbox"
            input1.name = "pod_id"
            input1.classList.add("select-pod")
            input1.value = podcast.collectionId


            const anchor2 = document.createElement("a")
            anchor2.setAttribute("href", '/podcast/' + podcast.collectionId)

            const figure = document.createElement("figure")
            figure.id = "podcast-holder"

            const image = document.createElement("img")
            image.setAttribute("src", podcast.imageUrl)
            image.id = "podcast-image"

            anchor2.appendChild(image)
            figure.appendChild(anchor2)
            li2.append(input1)
            li2.append(figure)
            ul2.append(li2)
        }

        const input2 = document.createElement("input")
        input2.className = "button delete-button podsaint-button margin-top"
        input2.type = "submit"
        input2.value = "Remove selected podcasts"

        form.appendChild(div2)
        form.appendChild(ul2)

        div2.appendChild(h2)

        mainSection.appendChild(div2)
        mainSection.appendChild(ul2)

        form.appendChild(mainSection)
        form.appendChild(input2)

        await setEventListenerRemovePodcast(url, input2, id)
        await setEventListenerRemoveList(id)

    } else {
        //error function call
    }

}

async function setEventListenerRemovePodcast(url, input, id) {

    input.addEventListener("click", async function (event) {
        event.preventDefault()

        const checked = document.querySelectorAll('.select-pod:checked')

        const checkedValues = []
        for (const check of checked) {
            checkedValues.push(check.value)
        }

        console.log(checkedValues)

        const podId = {
            pod_id: checkedValues
        }

        const response = await fetch(
            "http://192.168.99.100:3000/api/remove-podcasts/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.accessToken,
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(podId)
        })

        console.log(JSON.stringify(response))

        if (response.status == 201) {
            document.getElementById("loader").classList.add("lds-hourglass")
            goToPage(url)
            document.getElementById("loader").classList.remove("lds-hourglass")

        } else {
            //Display oops
        }

    })

}

async function setEventListenerRemoveList(id) {

    document.getElementById("remove-list").addEventListener("submit", async function (event) {
        event.preventDefault()

        const response = await fetch(
            "http://192.168.99.100:3000/api/remove-playlist/" + id, {
            headers: {
                "Authorization": "Bearer " + localStorage.accessToken
            },
            method: "DELETE"
        })

        if (response.status == 201) {
            window.history.back()
        } else {
            //Display oops
        }

    })

}