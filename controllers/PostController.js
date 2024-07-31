import mongoose from "mongoose";
import PostService from "../services/post.service.js";

// Validate PostId
const validatePostId = (res, postId) =>{
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        res.status(400).json({
            message: "Invalid post ID"
        });
        console.log(postId);
        return true;
    }
    return false;
}
export default class PostController {

    static async index(req, res, next) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchKey = req.query.search;
        try {
            const posts =  await PostService.index(page, limit, searchKey);
            return res.status(200).json({
                message: '',
                posts : posts
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async createPost(req, res, next) {
        try {
            console.log(req.user);
            const result = await PostService.createPost(req, res);
            return res.status(result.status).json({
                message: result.message,
                post : result.newPost
            })
        } catch (error) {
            return res.status(result.status).json({
                message: error.message
            })
        }
    }

    static async updatePost(req, res) {
        try {
            const result = await PostService.updatePost(req, res);
            return res.status(200).json({
                message: result.message,
                post : result.updatedPost
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    static async fetchPost(req, res) {
        const { postId } = req.params;

        // Validate the postId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                message: "Invalid post ID"
            })
        }
        try {
            const result = await PostService.fetchPost(postId);
            return res.status(200).json({
                message: result.message,
                post : result.post
            })
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    }

    static async deletePost(req, res, next) {
        const { postId } = req.params;
        try {
            const result = await PostService.deletePost(postId);
            return res.status(result.status).json({
                message: result.message,
                post : result.post
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    static async fetchPostWithComments(req, res) {
        const { postId } = req.params;
		const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const searchKey = req.query.search;
        // Validate the postId
        if (validatePostId(res, postId)) {
            return;
        }
        try {
            const result = await PostService.fetchPostWithComments(postId, page, limit, searchKey);
            return res.status(200).json({
                message: "Comments fetched successfully",
                data: result
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    static async incrementViewCount(req, res) {
        const { postId } = req.params;
        // Validate the postId
        if (validatePostId(res, postId)) {
            return;
        }

        try {
            const formattedDate = await PostService.incrementViewCount(postId);
            return res.status(200).json({
                message: "View count increment successfully",
                viewCount: formattedDate
            });

        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    static async addFavoritePost(req, res){
        const { postId, userId } = req.params;
        // Validate the postId
        if (validatePostId(res, postId)) {
            return;
        }
        if (validatePostId(res, userId)) {
            return;
        }

       try {
            const result = await PostService.addFavoritePost(postId, userId);
            return res.status(200).json({
                message: "View count increment successfully",
                result: result
            });
       } catch (error) {
            return res.status(500).json({
                message: error.message
            })
       }
    }
}

