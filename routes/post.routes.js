import express from "express";
import PostController from "../controllers/PostController.js";
import { validationMiddleware } from '../validation.js';

import { createPost } from '../zod.js';
import upload from "../config/multer.js";


const postRoute = express.Router();

postRoute.post('/post',PostController.createPost);

export default postRoute;