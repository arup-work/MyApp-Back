import mongoose from "mongoose";

// Define a schema
const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment',CommentSchema);

export default Comment;