import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        author: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        genre: {
            type: String,
            default: "",
        },

        pageCount: {
            type: Number,
            default: 0,
        },

        publishedYear: {
            type: Number,
        },

        isbn: {
            type: String,
            default: "",
        },

        coverImage: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Book", bookSchema);