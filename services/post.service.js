// service/post.service.js
import upload from "../config/multer.js";
import Comment from "../models/comment.js";
import Post from "../models/post.js";
import User from "../models/user.js";

class PostService {
    static async index(page, limit, searchKey) {
        const skip = (page - 1) * limit;

        try {
            // Build the search query
            const searchQuery = {};
            if (searchKey) {
                searchQuery.$or = [
                    { title: { $regex: searchKey, $options: 'i' } }, // Case-insensitive search
                    { description: { $regex: searchKey, $options: 'i' } }
                ]
            }

            const totalPost = await Post.countDocuments();
            const totalSearchPost = await Post.countDocuments(searchQuery);
            const totalPages = Math.ceil(totalSearchPost / limit);

            // If there are no matching comments, return an empty array and appropriate metadata
            if (totalSearchPost === 0) {
                return {
                    posts: [],
                    totalSearchPost,
                    totalPost,
                    currentPage: 1,
                    totalPages: 1
                };
            }

            // If the requested page is greater than totalPages, reset to last page
            const currentPage = page > totalPages ? totalPages : page;
            const adjustedSkip = (currentPage - 1) * limit;

            const posts = await Post
                .find(searchQuery)
                .sort({ createdAt: -1 })
                .skip(adjustedSkip)
                .limit(limit);

            // Construct the full URL of the image 
            const postsWithFullImagePath = posts.map(post => ({
                ...post._doc,
                image: post.image ? `${process.env.BASE_URL}/uploads/${post.image}` : null
            }));

            // Calculate the starting and ending indices for the current page
            const startEntry = adjustedSkip + 1;
            const endEntry = Math.min(skip + limit, totalSearchPost);


            return {
                totalPost,
                currentPage: page,
                totalPage: Math.ceil(totalSearchPost / limit),
                post: postsWithFullImagePath,
                message: `Showing ${startEntry} to ${endEntry} of ${totalPost} entries`
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
                        image: imagePath,
                        userId: req.user.id,
                        modifiedAt: Date.now()
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

    static async updatePost(req, res) {
        const { postId } = req.params;
        return new Promise((resolve, reject) => {
            upload.single('file')(req, res, async (err) => {
                if (err) {
                    reject({ status: 400, message: err.message });
                }

                const { title, description } = req.body;
                const image = req.file ? req.file.path.replace(/\\/g, '/').replace('public/', '') : null;

                try {
                    const post = await Post.findById(postId);
                    if (!post) {
                        return reject({ status: 404, message: 'Post not found' });
                    }

                    post.title = title;
                    post.description = description;
                    post.modifiedAt = Date.now();


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

                    resolve({ status: 200, message: "Post updated successfully", updatedPost })
                } catch (error) {
                    reject({ status: 500, message: error.message });
                }
            })
        })
    }

    static async deletePost(postId) {
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

            const postWithUser = await post.populate('userId', 'name');
            const postWithUserName = {
                ...postWithUser._doc,
                userName: postWithUser.userId.name
            }

            return {
                message: "Post fetched succesfully",
                post: postWithUserName
            };
        } catch (error) {
            throw error;
        }
    }

    static async fetchPostWithComments(postId, page, limit, searchKey) {
         const skip = (page - 1) * limit;
 
         try {
             const { post } = await PostService.fetchPost(postId);
 
             // Build the search query
             const searchQuery = { postId };
             if (searchKey) {
                 searchQuery.comment = { $regex: searchKey, $options: 'i' }; // Case-insensitive search
             }
 
             const totalComments = await Comment.countDocuments(searchQuery);
             const totalPages = Math.ceil(totalComments / limit);
 
             // If there are no matching comments, return an empty array and appropriate metadata
             if (totalComments === 0) {
                 return {
                     post,
                     comments: [],
                     totalComments,
                     currentPage: 1,
                     totalPages: 1
                 };
             }
 
             // If the requested page is greater than totalPages, reset to last page
             const currentPage = page > totalPages ? totalPages : page;
             const adjustedSkip = (currentPage - 1) * limit;
 
             /**
              *.populate('userId', 'name'): The populate method replaces the userId field in each comment with the corresponding user document from the User collection. The second argument, 'name', specifies that only the name field of the user should be included in the populated document.
              */
             const comments = await Comment.find(searchQuery)
                 .sort({ createdAt: -1 })
                 .populate('userId', 'name')
                 .skip(adjustedSkip)
                 .limit(limit);
 
 
             // Convert comment to include user name directly
             const commentsWithUserName = comments.map(comment => ({
                 /**
                  * The ... syntax (spread operator) is used to create a new object that contains all the properties of the original comment document (comment._doc holds the original comment data).
                  */
                 ...comment._doc,
                 userName: comment.userId.name
             }));
 
             return {
                 post,
                 comments: commentsWithUserName,
                 totalComments,
                 currentPage: page,
                 totalPage: Math.ceil(totalComments / limit)
             };
         } catch (error) {
             throw new Error(error.message);
         }
     }
    

    static async incrementViewCount(postId) {
        try {
            const post = await Post.findById(postId);
            post.viewCount += 1;
            await post.save();

            return PostService.formatViewCount(post.viewCount);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static formatViewCount(count) {
        if (count >= 1000000000) {
            return (count / 1000000000).toFixed(1) + 'B';
        } else if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'k';
        } else {
            return count.toString();
        }
    }

    static async addFavoritePost(postId, userId) {
        try {
            const user = await User.findById(userId);
            const post = await Post.findById(postId);

            if (!user) {
                throw new Error('User not found');
            } 
            if (!post) {
                throw new Error('Post not found');
            }

            if (!user.favoritePosts.includes(post._id)) {
                user.favoritePosts.push(post._id);
                await user.save();
            }
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async allPostUpdate() {
        // const verifyAll = await Post.updateMany({}, {
        //     $set : {
        //         userId : '66770af698d2aad949d0f3e6'
        //     }
        // })
        // console.log(verifyAll);

        // const posts1 = await Post.find({ modifiedAt: { $exists: true } });

        // const updatePromises = posts1.map(post => {
        //     post.modifiedAt = post.createdAt;
        //     return post.save();
        // });

        // await Promise.all(updatePromises);
        // console.log('All posts updated successfully');
    }
}

export default PostService;
