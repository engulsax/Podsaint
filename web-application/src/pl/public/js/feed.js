document.addEventListener("DOMContentLoaded", function(){

    const podSections = document.getElementById("podcast-section")
    const playlists = podSections.children

    for(let playlist of playlists){
   
        const podLink = document.getElementById(playlist.id+"-link")
       
        podLink.addEventListener("click", function(){
           for(let playlist of playlists){
               playlist.style.display = "none"
           }
            playlist.style.display = "block"
        })

        if(playlist.id == "your-podcasts"){
            continue
        }
        playlist.style.display="none"
    }

})