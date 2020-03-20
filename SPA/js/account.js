import {makeSlickCarousel} from './slick.js'

export async function getUserPlaylists() {

    document.getElementById("no-podcasts").innerText = ""

    const response = await fetch(
        "http://192.168.99.100:3000/api/userplaylists", {
			headers: {
                "Authorization": "Bearer " + localStorage.accessToken
            }
        })

    const playlists = await response.json()

    if(response.status == 200){

        if(playlists.length == 0){
            document.getElementById("no-podcasts").innerText = "You have no lists"
            return
        }

        const div1 = document.getElementById("my-playlists")
        div1.innerText = ""
    
        const ul1 = document.createElement("ul")
        ul1.id = "podcast-section"
    
        for(const playlist of playlists){
    
            const li1 = document.createElement("li")
            
            const div2 = document.createElement("div")
            div2.className ="cell small-11"

            const h2 = document.createElement("h2")
            h2.className = "sub-text no-margin center"
            h2.innerText = playlist.playlistName
    
            const div3 = document.createElement("div")
            div3.className ="cell small-11 center"
    
            const anchor1 = document.createElement("a")
            anchor1.className ="no-margin"
            anchor1.setAttribute("href", "/edit/" + playlist.playlistName )
            anchor1.innerText = "Edit List"
    
            const section = document.createElement("section")
            section.className ="cell small-8 center"
            section.id = "slideshow"
    
            const ul2 = document.createElement("ul")
            ul2.className ="slick"
    
            for(const podcast of playlist.podcasts){
    
                const li2 = document.createElement("li")
    
                const anchor2 = document.createElement("a")
                anchor2.setAttribute("href", '/podcast/' + podcast.collectionId)

                const figure = document.createElement("figure")
                figure.id = "podcast-holder"
    
                const image = document.createElement("img")
                image.setAttribute("src", podcast.imageUrl)
                image.id = "podcast-image"
    
                anchor2.appendChild(image)
                figure.appendChild(anchor2)
                li2.appendChild(figure)
                ul2.append(li2)
            }
    
            section.appendChild(ul2)
    
            div3.appendChild(anchor1)
    
            div2.appendChild(h2)
    
            li1.appendChild(div2)
            li1.appendChild(div3)
            li1.appendChild(section)
           
            ul1.appendChild(li1)
        }
    
        div1.appendChild(ul1)

        makeSlickCarousel()

    } else {
        //error function call
    }
   
}