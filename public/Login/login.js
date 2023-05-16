
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const form = document.getElementById('login-form')
const msg = document.getElementById("msg-new")
const response = document.getElementById("response")
const url = "https://whatschatappa.onrender.com"

const token = localStorage.getItem("token")
if (token) {
    window.location.href = "../main/main.html"
}
form.addEventListener("submit", login)

async function login(e) {
    try {
        e.preventDefault();

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
            window.location.href = "../main/main.html"
            //}, 2000)
        }
    } catch (error) {
        console.log(error.response.data.message)
        updateDom(error.response.data.message)
        const forgotPasswordLink = document.createElement("a")
        forgotPasswordLink.href = "../forgotpassword/forgotPassword.html";
        forgotPasswordLink.textContent = "Forgot Password";
        response.appendChild(forgotPasswordLink);
    }
}
function updateDom(user) {
    msg.innerHTML = ""
    const item = document.createElement("li")
    item.textContent = user
    msg.appendChild(item)

}