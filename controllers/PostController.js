import upload from "../config/multer.js";
import Post from "../models/post.js";

export default class PostController {
    static async createPost(req, res, next) {
        console.log(req.body);
        upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    message: err
                })
            }
            const { title, description } = req.body;
            console.log(req.files);
            const image = req.file ? req.file.path : "null";
            const newPost = await Post.create({
                title,
                description,
                image
            })

            return res.status(200).json({
                message: "Post created succesfully"
            })
        })
    }

}

