const form = document.getElementById("my-form")
const emailInput = document.getElementById("email")
const closeBtn = document.getElementById("close-btn")
const url = "https://whatschatappa.onrender.com"
closeBtn.addEventListener("click", () => {
    window.location.href = "../main/main.html"
})

form.addEventListener("submit", addMember)

async function addMember(e) {
    try {
        e.preventDefault();
        const groupId = localStorage.getItem("activeGroup")
        const newMemberData = {
            email: emailInput.value,
            groupId: groupId
        }
        const token = localStorage.getItem("token")
        const serverResponse = await axios.post(`${url}/admin/addMember`,
            newMemberData,
            { headers: { "Authorization": token } })
        if (serverResponse.status === 200) {
            window.location.href = "../main/main.html"
        }
    } catch (error) {
        console.log(error)
    }
}