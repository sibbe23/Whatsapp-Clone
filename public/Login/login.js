
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const form = document.getElementById('login-form')
const msg = document.getElementById("msg-new")
const response = document.getElementById("response")
const url = "http://52.54.87.89:3000"

form.addEventListener("submit", login)

async function login(e) {
    try {
        e.preventDefault();
        const token = localStorage.getItem("token")
        if (token) {
            window.location.href = "../index/index.html"
        }
        const loginCredentials = {
            email: emailInput.value,
            password: passwordInput.value
        }
        const serverResponse = await axios.post(`${url}/login`, loginCredentials)
        updateDom(serverResponse.data.message)
        if (serverResponse.data.success === "true") {
            localStorage.setItem("token", serverResponse.data.token)
            localStorage.setItem("username", serverResponse.data.username)
            //setTimeout(() => {
            window.location.href = "../index/index.html"
            //}, 2000)
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