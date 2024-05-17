const express = require("express")
const router = express.Router()
const Comment = require("../models/Comment")
const Post = require("../models/Post")
const verifyToken = require("../verifyToken")
//Create Comment
router.post("/create", verifyToken, async (req, res) => {
    try {
        const comment = await Comment.create(req.body)
        res.status(200).json(comment)
    }
    catch (error) {
        res.status(500).json(error)
    }
})
//update Comment
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        if(updatedComment){
            // const Comments =await Comment.find();
               res.status(200).json(updatedComment)
        }
     
    }
    catch (error) {
        res.status(500).json(error)
    }
})
// Delete Comment
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const comment= await Comment.findByIdAndDelete(req.params.id)
        res.status(200).json(comment)

    }
    catch (error) {
        res.status(500).json(error)
    }

})
//Get Comment By PostId
router.get("/post/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId })
        res.status(200).json(comments)
    }
    catch (error) {
        res.status(500).json(error)
    }
})
module.exports = router