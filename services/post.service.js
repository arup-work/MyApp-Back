// service/post.service.js
import upload from "../config/multer.js";
import Post from "../models/post.js";

class PostService {
    static async index(page, limit) {
        const skip = (page - 1) * limit;

        try {
            const totalPost = await Post.countDocuments();
            const posts = await Post.find().sort({ createdAt: -1}).skip(skip).limit(limit);
            // Construct the full URL of the image 
            const postsWithFullImagePath = posts.map(post => ({
                ...post._doc,
                image: post.image ? `${process.env.BASE_URL}/uploads/${post.image}` : null
            }));

            return {
                totalPost,
                currentPage: page,
                totalPage: Math.ceil(totalPost / limit), 
                post : postsWithFullImagePath
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async createPost(req, res) {
        return new Promise((resolve, reject) => {
            upload.single('file')(req, res, async (err) => {
                if (err) {
                    reject({ status: 400, message: err.message });
                }
                const { title, description } = req.body;
                const image = req.file ? req.file.path : null;
                const imagePath = req.file.path.replace(/\\/g, '/').replace('public/', '');
                try {
                    const newPost = await Post.create({
                        title,
                        description,
                        image: imagePath
                    });

                    // Check if the file exists and construct the full URL
                    const imageUrl = req.file ? `${process.env.BASE_URL}/${imagePath}` : null;

                    newPost.image = imageUrl;

                    resolve({ status: 200, message: "Post created successfully", newPost });
                } catch (error) {
                    reject({ status: 500, message: error.message });
                }
            });
        });
    }

    static async updatePost(req, res){
        const { postId } = req.params;
        return new Promise((resolve, reject) => {
            upload.single('file')(req, res, async (err) => {
                if (err) {
                    reject({ status: 400, message: err.message });
                }

                const { title, description } = req.body;
                const image = req.file ? req.file.path.replace(/\\/g, '/').replace('public/', '') : null;

                try {
                    const post =  await Post.findById(postId);
                    if (!post) {
                        return reject({ status: 404, message: 'Post not found' });
                    }

                    post.title = title;
                    post.description = description;

                    if (req.file) {
                        post.image = req.file.path.replace(/\\/g, '/').replace('public/', '');
                    }

                    const updatedPost = await post.save();

                    if (!updatedPost) {
                        throw new Error('Post not found');
                    }

                    // Check if the file exists and construct the full URL
                    const imageUrl = req.file ? `${process.env.BASE_URL}/${image}` : null;
                    if (imageUrl) {
                        updatedPost.image = imageUrl;
                    }
                    
                    resolve({ status: 200, message: "Post updated successfully", updatedPost})
                } catch (error) {
                    reject({ status: 500, message: error.message });
                }
            })
        })
    }

    static async deletePost(postId){
        try {
            const post = await Post.findById(postId);
            if (!post) {
               throw new Error("Post not found!")
            }
            await post.deleteOne();
            return { status: 200, message: "Post deleted successfully", post };
        } catch (error) {
            throw { status: error.status || 500, message: error.message };
        }
    }

    static async fetchPost(postId) {
        try {
            const post = await Post.findById(postId);
            if (!post) {
               throw new Error("Post not found!")
            }
            // Construct the full URL of the image 
            post.image = post.image ? `${process.env.BASE_URL}/uploads/${post.image}` : null;

            return {
                message : "Post fetched succesfully",
                post
            };
        } catch (error) {
            throw error;
        }
    }
}

export default PostService;
