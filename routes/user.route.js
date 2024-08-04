import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import UserController from '../controllers/UserController.js';

const userRoute = express.Router();

// Add favorite
userRoute.post(
    '/:userId/favorites/:postId',
    [authMiddleware],
    UserController.addFavoritePost
);

// Remove favorite
userRoute.delete(
    '/:userId/favorites/:postId',
    [authMiddleware],
    UserController.removeFavoritePost
);

// Get favorite posts
userRoute.get(
    '/:userId/favorites',
    [authMiddleware],
    UserController.getFavoritePosts
);

export default userRoute;