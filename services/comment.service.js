import Comment from "../models/comment.js";
import Post from "../models/post.js";
import PostService from "./post.service.js";

export default class CommentService {
    static async index(postId){
        try {
            const [post, comments] = await Promise.all([
                PostService.fetchPost(postId),
                Comment.find({ postId }).sort({ createdAt: -1 })
            ])
            return {post, comments};
        } catch (error) {
            throw new Error(error.message);
        }
    }
    static async addComment(user, comment, postId){
        try {
            const newComment = await Comment.create({
                comment,
                userId: user.id,
                postId
            });
            // Populate the userId field 
            const commentWithUser = await Comment.findById(newComment._id).populate('userId','name');
            const commentWithUserName = {
                ...commentWithUser._doc,
                userName: commentWithUser.userId.name
            };
            // Total comments for this post
            const totalComments = await Comment.countDocuments({ postId });

            return {commentWithUserName , totalComments};
        } catch (error) {
            throw new Error(error.message);
        }
       
    }

    static async fetchPost(commentId){
        try {
            const comment = await Comment.findById(commentId);
            return comment;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async updateComment(user, comment, commentId){
        try {
            const commentDetails = await Comment.findById(commentId);
            if (!commentDetails) {
                throw new Error("Comment not found");
            }
            if (commentDetails.userId.toString() !== user.id) {
                throw new Error("Unauthorized action"); 
            }
            commentDetails.comment = comment;
            await commentDetails.save();
            return commentDetails;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async deleteComment(user, commentId){
        try {
            const commentDetails = await Comment.findById(commentId);
            if (!commentDetails) {
                throw new Error("Comment not found");
            }
            if (commentDetails.userId.toString() !== user.id) {
                throw new Error("Unauthorized action"); 
            }
            await commentDetails.deleteOne();
            return commentDetails;
        } catch (error) {
            throw new Error(error.message);
        }
    }

}