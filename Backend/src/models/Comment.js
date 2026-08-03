import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
{
    content: {
        type: String,
        required: true,
        trim: true
    },
    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },

    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, 
{timestamps: true} //createdAt, updateAt
);

const Comment = mongoose.model("Comment", commentSchema)

export default Comment