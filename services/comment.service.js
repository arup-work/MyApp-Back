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
            console.log(comments);
            return {post, comments};
        } catch (error) {
            throw new Error(error.message);
        }
    }
    static async addComment(user, comment, postId){
        try {
            const newComment = Comment.create({
                comment,
                userId: user.id,
                postId
            });
            return newComment;
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
            if (!comment) {
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
}