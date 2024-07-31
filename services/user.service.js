import Post from "../models/post";
import User from "../models/user";

class UserService{
    // Add favorite post
    static async addFavoritePost(userId, postId){
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
            return user;
            
        } catch (error) {
            throw error;
        }
    }   
    // Remove favorite post
    static async removeFavoritePost(userId, postId){
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

            return user;
            
        } catch (error) {
            throw error;
        }
    }

}

export default UserService;