import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import UserController from '../controllers/UserController';

const userRoute = express.Router();

// Add favorite
userRoute.post(
    ':/userId/favorites/:postId',
    [authMiddleware],
    UserController.addFavoritePost
);

// Remove favorite
userRoute.post(
    ':/userId/favorites/:postId',
    [authMiddleware],
    UserController.removeFavoritePost
);

export default userRoute;