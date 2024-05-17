require("dotenv").config()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
//Register
router.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hashSync(password, salt)
        const newUser = await User.create({ username, email, password: hashedPassword })
        res.status(200).json(newUser)
    }
    catch (error) {
        res.status(500).json(error)

    }
})
//Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        console.log(user)
        if (!user) {
            return res.status(404).json("User Not Found")
        }
        const match = await bcrypt.compare(req.body.password, user.password)
        if (!match) {
            return res.status(401).json("Invalid Credentials")
        }
        const { password, ...info } = user._doc;
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET, { expiresIn: "3d" })
        res.cookie("token", token).status(200).json(info)

    }
    catch (error) {

    }
})
//Logout
router.get("/logout", (req, res) => {
    try {
        res.clearCookie("token", { sameSite: "none", secure: true }).status(200).json("User Logged Out")
    }
    catch (error) {
        res.status(500).json(error);
    }
})
//refetch
router.get("/refetch", (req, res) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(403).json("You are not Authorized")
    }
    jwt.verify(token, process.env.SECRET, async (err, data) => {
        if (err) {
            return res.status(403).json(err)
        }
        res.status(200).json(data);
    })
})
module.exports = router