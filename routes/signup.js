const express = require('express')
const router = express.Router()

const signupControllers = require("../controllers/signup")


router.post("/signup", signupControllers.signup)

router.post("/login", signupControllers.login)

module.exports = router