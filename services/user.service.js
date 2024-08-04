import Post from "../models/post.js";
import User from "../models/user.js";

class UserService {
    // Add favorite post
    static async addFavoritePost(userId, postId) {
        try {
            const post = await Post.findById(postId);
            const user = await User.findById(userId);
            if (!post || !user) {
                throw new Error("Post or user not found!");
            }

            if (!user.favoritePosts.includes(postId)) {
                user.favoritePosts.push(postId);
                await user.save();
            }
            return postId;

        } catch (error) {
            throw error;
        }
    }
    // Remove favorite post
    static async removeFavoritePost(userId, postId) {
        try {
            const post = await Post.findById(postId);
            const user = await User.findById(userId);
            if (!post || !user) {
                throw new Error("Post or user not found!");
            }

            // Remove the post from the user's favorite
            user.favoritePosts = user.favoritePosts.filter(
                (favPostId) => !favPostId.equals(postId)
            );
            await user.save();

            return postId;

        } catch (error) {
            throw error;
        }
    }
    // Get all favorite post
    static async getFavoritePosts(page, limit, searchKey, userId) {
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

            const user = await User.findById(userId).populate({
                path: 'favoritePosts',
                match: searchQuery, // Apply search query
                options: {
                    skip,
                    limit,
                    sort: { createdAt: -1}
                }
            });

            if (!user) {
                throw new Error("User not found!");
            }

            const totalFavoritePosts = user.favoritePosts.length;
            const totalPages = Math.ceil(totalFavoritePosts / limit);

             // Calculate the starting and ending indices for the current page
            const startEntry = skip + 1;
            const endEntry = Math.min(skip + limit, totalFavoritePosts);

            // Construct the full URL of the image
            const favoritePostsWithFullImagePath = user.favoritePosts.map(post => ({
                ...post._doc,
                image: post.image ? `${process.env.BASE_URL}/uploads/${post.image}` : null
            }));

            return {
                totalFavoritePosts,
                currentPage: page,
                totalPage: totalPages,
                favoritePosts: favoritePostsWithFullImagePath,
                message: `Showing ${startEntry} to ${endEntry} of ${totalFavoritePosts} entries`
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

}

export default UserService;