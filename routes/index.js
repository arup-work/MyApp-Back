import express from 'express'
import authRoute from "./auth.routes.js";
import postRoute from "./post.routes.js";
import commentRoute from './comment.routes.js';
import User from '../models/user.js';

const Route = express.Router();

Route.use(
    '/auth',authRoute
)

Route.use(
    '/user',User
)

Route.use(
    '/post', postRoute
)
Route.use(
    '/comment', commentRoute
)

export default Route;