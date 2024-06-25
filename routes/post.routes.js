import express from "express";
import PostController from "../controllers/PostController.js";
import { validationMiddleware } from '../validation.js';

import { createPost } from '../zod.js';
import upload from "../config/multer.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const postRoute = express.Router();

postRoute.get('',[authMiddleware],PostController.index)
postRoute.post('',[authMiddleware],PostController.createPost);
postRoute.get('/:postId',PostController.fetchPost);
postRoute.put('/:postId',PostController.updatePost);
postRoute.delete('/:postId',PostController.deletePost);

export default postRoute;