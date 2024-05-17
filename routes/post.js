const bcrypt = require("bcrypt")
const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Comment = require("../models/Comment")
const Post = require("../models/Post")
const verifyToken = require("../verifyToken")
//Create Post
router.post("/create", verifyToken, async (req, res) => {
    try {
        const post = await Post.create(req.body)
        res.status(200).json(post)
    }
    catch (error) {
        res.status(500).json(error)
    }
})
//update Post
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedPost)
    }
    catch (error) {
        res.status(500).json(error)
    }
})
// Delete Post
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const post= await Post.findByIdAndDelete(req.params.id)
        console.log(post)
        res.status(200).json(post)

    }
    catch (error) {
        res.status(500).json(error)
    }

})
//Get Post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
    }
    catch (error) {
        res.status(500).json(error)
    }
})
//Get All Posts
router.get("/", async (req, res) => {
    const query = req.query
    console.log(query)
    try {
        const searchFilter = {
            title: { $regex: query.search, $options: "i" }
        }
        const posts = await Post.find(query.search ? searchFilter : null)
        res.status(200).json(posts)
    }
    catch (error) {
        res.status(500).json(error)
    }
})
//Get UserPosts
router.get("/user/:userId", verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId })
        res.status(200).json(posts)
    }
    catch (error) {
        res.status(500).json(error)
    }
})
module.exports = router