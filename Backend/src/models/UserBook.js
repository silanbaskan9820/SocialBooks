import mongoose from "mongoose";

const userBookSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },

        status: {
            type: String,
            enum: [
                "reading",
                "wishlist",
                "completed",
            ],
            default: "wishlist",
        },

        currentPage: {
            type: Number,
            default: 0,
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },

        notes: {
            type: String,
            default: "",
        },

        startedAt: {
            type: Date,
        },

        finishedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("UserBook", userBookSchema);