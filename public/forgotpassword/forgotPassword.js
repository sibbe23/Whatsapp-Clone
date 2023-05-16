const form = document.getElementById("forgotPassword")
const email = document.getElementById("email")
const url = "http://52.54.87.89:3000"

form.addEventListener("submit", resetPassword)


async function resetPassword(e) {
    try {
        e.preventDefault();
        const inputEmail = {
            email: email.value
        }
        const response = await axios.post(`${url}/password/forgotpassword`, inputEmail)
        console.log(response)
    } catch (err) {
        console.log(err)
    }
}