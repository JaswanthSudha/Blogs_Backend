const bcrypt = require("bcrypt")
const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Comment = require("../models/Comment")
const Post = require("../models/Post")
const verifyToken = require("../verifyToken")
//update
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        // console.log(user)
        if (user) {
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hashSync(req.body.password, salt)
                req.body.password = hashedPassword
            }
            console.log(req.body.password)
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true })
            res.status(200).json(updatedUser)
        }
        else {
            return res.status(500).json("User Not Found")
        }

    }
    catch (error) {
        res.status(500).json(error)
    }
})
// Delete User
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        await Post.deleteMany({ userId: req.params.id })
        await Comment.deleteMany({ userId: req.params.id })
        res.status(200).json("User is deleted")

    }
    catch (error) {
        res.status(500).json(error)
    }

})
//Get User
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...info } = user._doc
        res.status(200).json(info)
    }
    catch (error) {
        res.status(500).json(error)
    }
})
module.exports = router