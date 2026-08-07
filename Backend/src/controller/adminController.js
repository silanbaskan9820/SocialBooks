import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Book from "../models/Book.js";

export async function getDashboard(req, res) {

    try {

        const users = await User.countDocuments();
        const posts = await Post.countDocuments();
        const comments = await Comment.countDocuments();
        const books = await Book.countDocuments();

        const bannedUsers = await User.countDocuments({ isBanned: true });

        const activeUsers = await User.countDocuments({ isBanned: {$ne: true} });

        res.status(200).json({ 
            users,
            posts,
            comments,
            books,
            bannedUsers,
            activeUsers,
        });

    } catch (error) {
        console.error("Dashboard error: ", error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function getAllUsers(req, res) {
    try {

        const { 
            search, 
            role, 
            status, 
            privacy, 
            page = 1, 
            limit = 10 
        } = req.query;

        const filter = {};

        if(search) {
            filter.$or = [
                {username: { $regex: search, $options: "i" } },
                {name: { $regex: search, $options: "i" } },
                {surname: { $regex: search, $options: "i" } },
                {email: { $regex: search, $options: "i" } },
            ]
        }

        if (role) {
            filter.role = role;
        }

        if (status === "banned") {
            filter.isBanned = true;
        }

        if (status === "active") {
            filter.isBanned = false;
        }

        if (privacy === "private") {
            filter["privacy.privateAccount"] = true;
        }

        if (privacy === "public") {
            filter["privacy.privateAccount"] = false;
        }

        const totalUsers = await User.countDocuments(filter);

        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1})
            .skip((page -1) * limit)
            .limit(Number(limit));

            const usersWithStats = await Promise.all(
                users.map(async (user) => {
                    
                    const postsCount = await Post.countDocuments({ 
                        author: user._id 
                    });

               return {
                ...user.toObject(), 
                followersCount: user.followers.length, 
                followingCount: user.following.length, 
                postsCount,
            };
        })
    );

            res.status(200).json({
                users: usersWithStats,
                totalUsers,
                currentPage: Number(page),
                totalPages: Math.ceil(totalUsers / limit),
            });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function banUser(req, res) {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        user.isBanned = !user.isBanned;

        await user.save();

        res.status(200).json({
            message: user.isBanned
                ? "User banned successfully"
                : "User unbanned successfully",
            user,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function getUserDetail(req, res) {

    try {
        const { id } = req.params;

        // console.log("DETAIL USER ID: ", id)

        const user = await User.findById(id).select("-password");

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const postsCount = await Post.countDocuments({
            author: user._id
        });

        const commentsCount = await Comment.countDocuments({
            user: user._id
        });

        const posts = await Post.find({ author: user._id }).sort({ createdAt: -1});

        const comments = await Comment.find({ user: user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            user: {
                ...user.toObject(),
                followersCount: user.followers?.length || 0,
                followingCount: user.following?.length || 0,
                postsCount,
                commentsCount
            },

            posts,
            comments

        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function updateUserRole(req, res) {

    try {

        const { id } = req.params;
        const { role } = req.body;

        const allowedRoles = ["user", "admin", "superadmin"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role."
            });
        }

        const user = await User.findById(id);

        if(!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const currentUser = req.user;

        if (currentUser.role !== "superadmin") {
            return res.status(403).json({
                message: "Only superadmin can change user roles."
            });
        }

        if (
            user.role === "superadmin" &&
            user._id.toString() !== currentUser._id.toString()
        ) {
            return res.status(403).json({
                message: "You cannot change another superadmin's role."
            });
        }

        if (
            user._id.toString() === currentUser._id.toString()
        ) {
            return res.status(403).json({
                message: "You cannot change your own role."
            });
        }

        user.role = role;

        await user.save();

        res.status(200).json({
            message: "User role updated successfully.",
            user: {
                _id: user._id,
                username: user.username,
                role: user.role
        }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}