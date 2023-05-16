const nameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const phoneInput = document.getElementById("phone")
const passwordInput = document.getElementById("password")
const form = document.getElementById("form")
const msg = document.getElementById('msg')
const url = "http://localhost:3000"

form.addEventListener("submit", onSubmit)

async function onSubmit(e) {
    try {
        e.preventDefault();
        const userData = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            password: passwordInput.value
        }
        const serverResponse = await axios.post(`${url}/signup`, userData);
        console.log(serverResponse)
        if (serverResponse.data.status === "success") {
            updateDom(serverResponse.data.message)
            // setTimeout(() => {
            window.location.href = "../login/login.html"
            // }, 2000)

        } else {

            console.log(serverResponse.response.data.message)

        }
    } catch (error) {
        console.log(error.response.data.message)
        updateDom(error.response.data.message)
    }
}

function updateDom(user) {
    msg.innerHTML = ""
    msg.innerHTML+=`<div>${user}</div>`
    setTimeout(()=>{
        msg.innerHTML = ""
    },3000)
   
}
