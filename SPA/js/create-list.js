document.addEventListener("DOMContentLoaded", async function(event){

    const createBtn = document.getElementById("create-new-list-btn")
    const inputField = document.getElementById("input-listname")
    const createListError = document.getElementById("create-list-error")

    createBtn.addEventListener("click", async function(event){
        event.preventDefault()
        
        createListError.innerText = ""

        if (inputField.value == ""){
            createListError.innerText = "Enter a valid name"
            return
        }

        console.log(inputField.value)

        const body = {
            playlistName: inputField.value
        }

        console.log(body)

        const response = await fetch(
            "http://192.168.99.100:3000/api/create-list", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        if(response.status == 201){
            location.reload()
            return
        } else {
            //error
        }
    })
})