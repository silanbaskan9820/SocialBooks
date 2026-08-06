import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    surname: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    profileImage: {
        type: String,
        default: "",
    },

    bio: {
        type: String,
        default: "",
    },

    profileViews: {
        type:Number,
        default: 0,
    },

    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    notificationSettings: {
    likes: {
        type: Boolean,
        default: true,
    },
    comments: {
        type: Boolean,
        default: true,
    },
    follows: {
        type: Boolean,
        default: true,
    },
    system: {
        type: Boolean,
        default: true,
    },
},
privacy: {
    privateAccount: {
        type: Boolean,
        default: false,
    },
    showEmail: {
        type: Boolean,
        default: false,
    },
    showFollowers: {
        type: Boolean,
        default: true,
    },
    showFollowing: {
        type: Boolean,
        default: true,
    },
},

language: {
    type: String,
    enum: ["tr", "en"],
    default: "en",
},

role: {
    type: String,
    enum: ["user", "moderator", "admin", "superadmin"],
    default: "user",
},

isBanned: {
    type: Boolean,
    default: false,
},
}, 

{timestamps: true} //createdAt, updateAt
);

const User = mongoose.model("User", userSchema)

export default User