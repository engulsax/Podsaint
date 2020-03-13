document.addEventListener("DOMContentLoaded", function (event) {

    const searchForm = document.getElementById("search-form")

    searchForm.addEventListener("submit", async function (event) {
        try {

            event.preventDefault()

            const searchTerm = document.getElementById('search-term').value

            const response = await fetch("http://192.168.99.100:3000/api/search?term=" + searchTerm)
            const podcasts = await response.json()

            const ul = document.querySelector("ul#podcast-section")
            ul.innerHTML = ""

            if(podcasts[0].collectionId == undefined){
                const error = document.createElement("li")
                error.classList.add("sub-text")
                error.innerText = "No Podcasts Found"
                ul.append(error)
                return
            }

            for (const podcast of podcasts) {

                const li = document.createElement("li")

                const anchor = document.createElement("a")
                anchor.setAttribute("href", '/podcast/' + podcast.collectionId)
                const figure = document.createElement("figure")
                figure.classList.add("podcast-holder")
                figure.id = "podcast-holder"

                const image = document.createElement("img")
                image.setAttribute("src", podcast.imageUrl)
                image.id = "podcast-image"

                anchor.appendChild(image)
                figure.appendChild(anchor)
                li.appendChild(figure)
                ul.append(li)

            }

        } catch (error) {
            console.log(error)
        }
    })
})
