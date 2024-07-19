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
    },
    modifiedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Post = mongoose.model('Post', PostSchema);

// Pre-save middleware to update `modifiedAt` field
PostSchema.pre('save', function (next) {
    if (this.isNew) {
        this.modifiedAt = this.createdAt; // Set modifiedAt to createdAt on creation
    } else if (this.isModified('title') || this.isModified('description') || this.isModified('image')) {
        this.modifiedAt = Date.now(); // Update modifiedAt on specific field modification
    }
    next();
});

export default Post;