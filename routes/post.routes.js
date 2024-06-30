import express from "express";
import PostController from "../controllers/PostController.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const postRoute = express.Router();

//Get all posts (requires authentication)
postRoute.get(
    '',
    [authMiddleware],
    PostController.index
)

// Create a new post (requires authentication)
postRoute.post(
    '',
    [authMiddleware],
    PostController.createPost
);

// Get a single post by ID
postRoute.get(
    '/:postId',
    PostController.fetchPost
);

// Update a post by ID
postRoute.put(
    '/:postId',
    PostController.updatePost
);

// Delete a post by ID
postRoute.delete(
    '/:postId',
    PostController.deletePost
);

// Get a post along with its comments (requires authentication)
postRoute.get(
    '/:postId/comments',
    [authMiddleware],
    PostController.fetchPostWithComments
)

// Increment the view count for a specific post
postRoute.get(
    '/:postId/increment-view',
    [authMiddleware],
    PostController.incrementViewCount
)

export default postRoute;