import express from "express";
import { validationMiddleware } from "../middlewares/validation.js";
import { addComment } from "../zod.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import CommentController from "../controllers/CommentController.js";

const commentRoute = express.Router();

// commentRoute.get(
//     '/:postId',
//     [authMiddleware],
//     CommentController.index
// )

// Create a new comment (requires authentication)
commentRoute.post(
    '/:postId',
    [authMiddleware, validationMiddleware(addComment)],
    CommentController.addComment
);

// Get a single comment by Id (requires authentication)
commentRoute.get(
    '/:commentId',
    [authMiddleware],
    CommentController.fetchComment
);
// Update a single comment by Id (requires authentication)
commentRoute.put(
    '/:commentId',
    [authMiddleware],
    CommentController.updateComment
);
// Delete a single comment by Id (requires authentication)
commentRoute.delete(
    '/:commentId',
    [authMiddleware],
    CommentController.deleteComment
);
// Like a comment
commentRoute.post(
    '/:commentId/likes',
    [authMiddleware],
    CommentController.likeComment
)

export default commentRoute;