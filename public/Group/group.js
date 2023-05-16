const form = document.getElementById("my-form")
const groupName = document.getElementById("group-name")
const description = document.getElementById("group-desc")
const closeBtn = document.getElementById("close-btn")
const url = "http://52.54.87.89:3000"

closeBtn.addEventListener("click", () => {
    window.location.href = "../Index/index.html"
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
        const serverResponse = await axios.post(`${url}/groups/addgroup`,groupDetails,{ headers: { "Authorization": token } })
        console.log(serverResponse)
        if (serverResponse.status === 200) {
            alert("Create Group Success")
            window.location.href = "../Index/index.html"
        }
    } catch (error) {
        console.log(error)
        alert("something went wrong!!")
    }
}




