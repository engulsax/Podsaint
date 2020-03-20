
export async function populatePodcastInformation(url) {

    const id = url.split("/")[2]

    const titleDiv = document.getElementById("title")
    titleDiv.innerText = ""

    const creatorDiv = document.getElementById("creator")
    creatorDiv.innerText = ""

    const imageDiv = document.getElementById("image")
    imageDiv.innerText = ""

    const descriptionDiv = document.getElementById("description")
    descriptionDiv.innerText = ""

    const podcast = await fetchPodcastInformation(id)

    console.log("PODCAST " + JSON.stringify(podcast))

    if (podcast.collectionId == undefined) {
        const error = document.createElement("p")
        error.classList.add("sub-text")
        error.innerText = "No Podcasts Found"
        titleDiv.append(error)
        return
    }

    const h1 = document.createElement("h1")
    h1.innerText = podcast.collectionName
    titleDiv.appendChild(h1)

    const h2 = document.createElement("h2")
    h2.innerText = podcast.artistName
    creatorDiv.appendChild(h2)

    const image = document.createElement("img")
    image.src = podcast.posterUrl
    image.classList.add("float-responsive")
    image.id = "podcast-image-2"
    imageDiv.appendChild(image)

    const description = document.createElement("p")
    description.innerText = podcast.description
    descriptionDiv.appendChild(description)

    console.log(imageDiv)
}

async function fetchPodcastInformation(id) {

    try {
        console.log(id)
        const response = await fetch("http://192.168.99.100:3000/api/podcast/" + id)
        const podcast = await response.json()

        return podcast

    } catch (error) {
        console.log(error)
    }

}
