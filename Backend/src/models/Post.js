import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
    },

    content: {
        type: String,
        required: true,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    image: {
        type: String,
        default: "",
    },

    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    views: {
        type: Number,
        default: 0,
    },

    viewedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
}, 
{timestamps: true} //createdAt, updateAt
);

const Post = mongoose.model("Post", postSchema);

export default Post
