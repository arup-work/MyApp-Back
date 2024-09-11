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

// Validate CommentId
const validateCommentId = (res, commentId) =>{
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        res.status(400).json({
            message: "Invalid comment ID"
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
    static async addComment(req, res) {
        const { user, body: { comment, parentCommentId }, params: {postId} } = req;

        // Validate the postId
        if (validatePostId(res, postId)) {
            return;
        }
        try {
            const result = await CommentService.addComment(user, comment, postId , parentCommentId);
            res.status(200).json({
                message: "Comment added successfully",
                comment: result.commentWithUserName,
                totalComments : result.totalComments
             })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }

    static async fetchComment(req, res) {
        const{ params: {commentId}} = req;
         // Validate the commentId
         if (validateCommentId(res, commentId)) {
            return;
        }
        try {
            const result = await CommentService.fetchComment(commentId);
            res.status(200).json({
                message: "Comment fetch successfully",
                comment: result
            })
            
        } catch (error) {
            
        }
    }

    static async updateComment(req, res) {
        const { user, body: {comment},params: { commentId} } = req;
        // Validate the commentId
        if (validateCommentId(res, commentId)) {
            return;
        }
        try {
            const {commentDetails, topMostParentCommentId}  = await CommentService.updateComment(user, comment, commentId);
            return res.status(200).json({
                message: "Comment Update successfully",
                comment: commentDetails,
                topMostParentCommentId
            });
        } catch (error) {
            if (error.message === "Comment not found") {
                return res.status(404).json({ message: error.message });
            } 
            if (error.message === "Unauthorized action") {
                return res.status(403).json({ message: error.message });                
            }
            return res.status(500).json({ message: error.message });
        }
    }

    static async deleteComment(req, res){
        const { user, params: { commentId} } = req;
        // Validate the commentId
        if (validateCommentId(res, commentId)) {
            return;
        }
        try {
            const {commentDetails, deletedCount}  = await CommentService.deleteComment(user, commentId);
            return res.status(200).json({
                message: "Comment Deleted successfully",
                comment: commentDetails,
                deletedCommentCount: deletedCount
            });
        } catch (error) {
            if (error.message === "Comment not found") {
                return res.status(404).json({ message: error.message });
            } 
            if (error.message === "Unauthorized action") {
                return res.status(403).json({ message: error.message });                
            }
            return res.status(500).json({ message: error.message });
        }

    }

    static async likeComment(req,res){
        const { user, params: { commentId} } = req;
        // Validate the commentId
        if (validateCommentId(res, commentId)) {
            return;
        }
        try {
            const {comment , isLike} = await CommentService.likeComment(user, commentId);
            return res.status(200).json({
                message: `${isLike ? 'Thank you!' : ''}`,
                comment
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}