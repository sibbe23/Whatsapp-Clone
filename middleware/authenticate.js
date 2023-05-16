const jwt = require("jsonwebtoken")
const User = require("../models/user")

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header("Authorization")
        const user = jwt.verify(token, process.env.JWT_SECRET)
        User.findByPk(user.userId).
            then(user => {
                req.user = user
                next()
            })
            .catch(err => console.log(err))
    } catch (error) {
        res.status(500).json({ error, success: "false", message: "authentication failed" })
    }
}