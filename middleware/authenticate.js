const jwt = require("jsonwebtoken")
const User = require("../models/user")

exports.authenticate = async(req, res, next) => {
    try {
        const token = req.header("Authorization")
        const userdata = jwt.verify(token, "secretkey")
       const user =await User.findByPk(userdata.userId);
       req.user=user;
       next();
    } catch (error) {
        res.status(500).json({ error, success: false, message: "authentication failed" })
    }
}