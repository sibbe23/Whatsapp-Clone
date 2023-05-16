const form = document.getElementById("my-form")
const groupName = document.getElementById("group-name")
const description = document.getElementById("group-desc")
const memberEmails = document.getElementById("group-members")
const closeBtn = document.getElementById("close-btn")
const url = "https://whatschatappa.onrender.com"

closeBtn.addEventListener("click", () => {
    window.location.href = "../main/main.html"
})

form.addEventListener("submit", addGroup)

async function addGroup(e) {
    try {
        e.preventDefault()
        const groupDetails = {
            name: groupName.value,
            description: description.value
        }
        const token = localStorage.getItem("token")
        const serverResponse = await axios.post(`${url}/groups/addgroup`,
            groupDetails,
            { headers: { "Authorization": token } })
        if (serverResponse.status === 200) {
            alert("Create Group Success")
            window.location.href = "../main/main.html"
        }
    } catch (error) {
        console.log(error)
        alert("something went wrong!!")
        //window.location.href = "main.html"
    }
}




