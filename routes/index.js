import express from 'express'
import authRoute from "./auth.routes.js";
import postRoute from "./post.routes.js";

const Route = express.Router();

Route.use(
    '/auth',authRoute
)
Route.use(
    '/post', postRoute
)

export default Route;