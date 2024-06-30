import mongoose from "mongoose";

// Define a schema
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    description: {
        type: String,
        required: true,
        maxlength: 20000
    },
    image: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    viewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Post = mongoose.model('Post', PostSchema);

export default Post;