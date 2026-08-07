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

        const activeUsers = await User.countDocuments({ isBanned: false });

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