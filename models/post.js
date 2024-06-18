import mongoose from "mongoose";

// Define a schema
const PostSchema = new mongoose.Schema({
    title : {
        type: String,
        required : true,
        maxlength : 255 
    },
    description : {
        type : String,
        required : true,
        maxlength : 20000 
    },
    image : {
        type : String,
        required : true 
    }
}, {
    timestamps: true
});

const post = mongoose.model('Post', PostSchema);

export default post;