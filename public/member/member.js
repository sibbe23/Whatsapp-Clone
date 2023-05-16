const form = document.getElementById("my-form")
const emailInput = document.getElementById("email")
const closeBtn = document.getElementById("close-btn")
const url = "http://localhost:3000"
closeBtn.addEventListener("click", () => {
    window.location.href = "../index/index.html"
})

form.addEventListener("submit", addMember)

async function addMember(e) {
    try {
        e.preventDefault();
        const groupId = localStorage.getItem("groupId")
        const newMemberData = {
            email: emailInput.value,
            groupId: groupId
        }
        console.log(newMemberData)
        const token = localStorage.getItem("token")
        const serverResponse = await axios.post(`${url}/admin/addMember`,
            newMemberData,
            { headers: { "Authorization": token } })
        if (serverResponse.status === 200) {
            window.location.href = "../index/index.html"
        }
    } catch (error) {
        console.log(error)
    }
}

window.addEventListener('DOMContentLoaded',getUsers)
const memberlist = document.getElementById('memberlist')
async function getUsers(e){
    try{
        e.preventDefault();
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:3000/admin/getall',{headers:{"Authorization":token}})
        for(let i=0;i<response.data.length;i++){
            memberlist.innerHTML+=JSON.stringify(`<h6 class="fw-bold">Name :${response.data[i].name}</h6>`+`Email :`+response.data[i].email)+`<hr>`
        }
    }
    catch(err){
        console.log(err)
    }
}