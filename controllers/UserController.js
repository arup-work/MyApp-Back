import mongoose from "mongoose";
import UserService from "../services/user.service.js";


export default class UserController{
    static async addFavoritePost(req, res) {
        try {
            const { userId, postId } = req.params;
            const result = await UserService.addFavoritePost(userId, postId);
            return res.status(200).json({
                message: 'Added to favorite list',
                favoritePost : result
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async removeFavoritePost(req, res) {
        try {
            const { userId, postId } = req.params;
            const result = await UserService.removeFavoritePost(userId, postId);
            return res.status(200).json({
                message: 'Removed from your favorite list',
                removedPost : result
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async getFavoritePosts(req, res) {
        try {
            const { userId } = req.params;
            const { page = 1, limit = 10, search = '' } = req.query;
            const result = await UserService.getFavoritePosts(page, limit, search, userId);
           
            return res.status(200).json({
                message: 'Your favorite posts list',
                favoritePosts : result
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }
}