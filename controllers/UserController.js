import mongoose from "mongoose";
import UserService from "../services/user.service";


export default class UserController{
    static async addFavoritePost(req, res) {
        try {
            const { userId, postId } = req.params;
            const result = await UserService.addFavoritePost(userId, postId);
            return res.status(200).json({
                message: 'Added to favorite list',
                favoritePosts : result.favoritePosts
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
                message: 'Added to favorite list',
                favoritePosts : result.favoritePosts
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}