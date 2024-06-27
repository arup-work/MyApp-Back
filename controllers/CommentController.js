import mongoose from "mongoose";
import CommentService from "../services/comment.service.js"

// Validate PostId
const validatePostId = (res, postId) =>{
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        res.status(400).json({
            message: "Invalid post ID"
        });
        return true;
    }
    return false;
}
export default class CommentController{
    static async index(req, res) {
        const { postId } = req.params;

        // Validate the postId
        if (validatePostId(res, postId)) {
            return;
        }
        try {
            const result = await CommentService.index(postId);
            return res.status(200).json({
                message: "Comments fetch successfully",
                comments : result
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
    static async addPost(req, res) {
        const { user, body: { comment }, params: {postId} } = req;

        // Validate the postId
        if (validatePostId(res, postId)) {
            return;
        }
        try {
            const result = await CommentService.addPost(user, comment, postId)
            res.status(200).json({
                message: "Comment added successfully",
                comment: result
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }
}