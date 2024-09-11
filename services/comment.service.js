import Comment from "../models/comment.js";
import Post from "../models/post.js";
import PostService from "./post.service.js";

export default class CommentService {
    static async index(postId) {
        try {
            const [post, comments] = await Promise.all([
                PostService.fetchPost(postId),
                Comment.find({ postId }).sort({ createdAt: -1 })
            ])
            return { post, comments };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    static async addComment(user, comment, postId, parentCommentId) {
        try {
            const newComment = await Comment.create({
                comment,
                userId: user.id,
                postId,
                parentCommentId: parentCommentId || null
            });
            // Populate the userId field 
            const commentWithUser = await Comment.findById(newComment._id).populate('userId', 'name');
            const commentWithUserName = {
                ...commentWithUser._doc,
                userName: commentWithUser.userId.name
            };
            // Total comments for this post
            const totalComments = await Comment.countDocuments({ postId });

            return { commentWithUserName, totalComments };
        } catch (error) {
            throw new Error(error.message);
        }

    }

    static async fetchComment(commentId) {
        try {
            const comment = await Comment.findById(commentId).populate('userId', 'name');

            if (!comment) {
                throw new Error('Comment not found!');
            }

            // Fetch the nested comments for the main comment
            const nestedComments = await this.getChildren(commentId);

            return {
                ...comment._doc,
                children: nestedComments
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async updateComment(user, comment, commentId) {
        try {
            const commentDetails = await Comment.findById(commentId);
            if (!commentDetails) {
                throw new Error("Comment not found");
            }
            if (commentDetails.userId.toString() !== user.id) {
                throw new Error("Unauthorized action");
            }

            // Find the topmost parent comment ID
            const topMostParentCommentId = await this.getTopmostParentCommentId(commentDetails);

            commentDetails.comment = comment;
            await commentDetails.save();
            return { commentDetails, topMostParentCommentId };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async deleteComment(user, commentId) {
        try {
            const commentDetails = await Comment.findById(commentId);
            if (!commentDetails) {
                throw new Error("Comment not found");
            }
            if (commentDetails.userId.toString() !== user.id) {
                throw new Error("Unauthorized action");
            }
            // Fetch and delete nested comments recursively
            let deletedCount = await this.deleteNestedComments(commentId);

            await commentDetails.deleteOne();
            deletedCount += 1;

            return { commentDetails, deletedCount };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Like comment
    static async likeComment(user, commentId) {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new Error("Comment not found");
        }

        // Check if the user is already liked the comment
        if (comment.likes.includes(user.id)) {
            // Remove userId from the likes array
            comment.likes = comment.likes.filter(id => id.toString() !== user.id.toString());
            await comment.save();
            return { comment, isLike: false}
        }

        // Add userId to the likes array
        comment.likes.push(user.id);
        await comment.save();

        return { comment, isLike: true}
    }

    // Total like comment
    static async getComment(commentId) {
        try {
            const comment = await Comment.findById(commentId).populate('userId', 'name');
            if (!comment) {
                throw new Error("Comment not found");
            }
    
            return {
                comment,
                likesCount: comment.likes.length,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    

    // Fetch children recursively
    static async getChildren(parentId) {
        const children = await Comment
            .find({ parentCommentId: parentId })
            .sort({ createdAt: -1 })
            .populate('userId', 'name');
        return Promise.all(children.map(async (child) => ({
            ...child._doc,
            userName: child.userId.name,
            children: await this.getChildren(child._id) // Recursive call to fetch nested children
        })))
    }

    // Recursively delete nested comments
    static async deleteNestedComments(parentId) {
        const children = await Comment.find({ parentCommentId: parentId });
        let deletedCount = 0;
        for (const child of children) {
            // Recursively delete children comment
            deletedCount += await this.deleteNestedComments(child._id);
            // Delete the child comment itself
            await Comment.deleteOne({ _id: child._id })
            deletedCount += 1;
        }
        return deletedCount;
    }

    // Find the topmost parent comment ID
    static async getTopmostParentCommentId(commentDetails) {
        let currentComment = commentDetails;
        while (currentComment.parentCommentId) {
            currentComment = await Comment.findById(currentComment.parentCommentId);
        }
        return currentComment._id; //Topmost comment's id
    }


}