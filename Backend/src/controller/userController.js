import User from "../models/User.js";
import Post from "../models/Post.js"
import Notification from "../models/Notification.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
    try {
        const {username, name, surname, email, password} = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const existingUsername = await User.findOne({ username });

if (existingUsername) {
    return res.status(409).json({
        message: "Username already exists",
    });
}

const existingEmail = await User.findOne({ email });

if (existingEmail) {
    return res.status(409).json({
        message: "Email already exists",
    });
}

        const user = await User.create({
            username, 
            name, 
            surname, 
            email, 
            password : hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error){
        console.error("Error in registerUser controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function loginUser(req,res) {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({
                message:"User not found"
            });
         }
         
         const isMatch = await bcrypt.compare(
            password, 
            user.password
        );
        
        if(!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }
        
        const token = jwt.sign({
            id: user._id
        },
        
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
    
    res.status(200).json({message: "Login successful", 
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email
        }
    });
} catch (error){
        console.error("Error in loginUser controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function getUser(req, res) {
    try {
        const user = await User.findById(req.params.id).select("-password");
        //console.log(user);

        //console.log("Profile ID:", req.params.id);

        const allPosts = await Post.find();
        //console.log("All Posts:", allPosts);

        const posts = await Post.find({
            author: req.params.id,
        })
        .populate("author", "username profileImage")
        .sort({ createdAt: -1});

        /*//console.log("Filtered Posts:", posts);*/

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isOwner = req.user && req.user._id.toString() === user._id.toString();

        const isFollower = req.user && user.followers.some(follower => follower.toString() === req.user._id,toString());

        if (user.privacy.privateAccount && !isOwner && !isFollower) {
            return res.status(403).json({
                message: "This account is private."
            })
        }

        res.status(200).json({ user, posts });

    } catch (error) {
        console.error("Error in getUser controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function updateUser(req, res) {
    try {

        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({
                message: "You are not authorized to update this user"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument:"after" }
        );

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in updateUser controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function followUser(req,res) {
    try{
        const user = await User.findById(req.params.id);

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        const alreadyFollowing = req.user.following.some(
            follow => follow.toString() === user._id.toString()     
        );

       let message;

       if(alreadyFollowing) {

        req.user.following = req.user.following.filter(
            follow => follow.toString() !== user._id.toString()
        );

        user.followers = user.followers.filter(
            follower => follower.toString() !== req.user._id.toString()
        );

        message = "User unfollowed successfully"
       } else {

        req.user.following.push(user._id);

        user.followers.push(req.user._id);

        await Notification.create({
            recipient: user._id,
            sender: req.user._id,
            type:"follow",
        })

        message = "Successfully following"
       }

       await req.user.save();
       await user.save();

       res.status(200).json({
        message,
        followingCount: req.user.following.length,
        followersCount: user.followers.length,
        following: !alreadyFollowing
       });

    } catch (error) {
        console.error("Error in followUser controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function getFollowers(req, res) {
    try {

        const user = await User.findById(req.params.id)
            .populate(
                "followers",
                "username name surname profileImage"
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(user.followers);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });

    }
}

export async function getFollowing(req, res) {
    try {

        const user = await User.findById(req.params.id)
            .populate(
                "following",
                "username name surname profileImage"
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(user.following);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });

    }
}

export async function searchUsers(req,res) {
    try {
    
        const {query} = req.query; 

         if(!query || !query.trim()) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const users = await User.find({
            $or: [
                {
                    username: {
                        $regex: query.trim(),
                        $options: "i"
                    }
                },
                {
                    name: {
                        $regex: query.trim(),
                        $options: "i"
                    }
                },
                 {
                    surname: {
                        $regex: query.trim(),
                        $options: "i"
                    }
                }
            ]
        })
        .select("username name surname")
        .limit(10);

        res.status(200).json(users);

    } catch(error) {
        console.error("Error in searchUser controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function updateProfilePhoto(req, res) {
    try {

        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({
                message: "You are not authorized"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "No image uploaded"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.profileImage = `/uploads/${req.file.filename}`;

        await user.save();

        res.status(200).json(user);

    } catch (error) {

        console.error("Error in updateProfilePhoto controller", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
}

export async function changePassword (req, res) {
    try {

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        if(!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if(!isMatch) {
            return res.status(400).json({
                message:"Current password is incorrect."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        res.json({ message: "Password updated successfully." });
    } catch(error) {
        console.error(error);

        res.status(500).json({ message: "Server Error" });
    }
};
export const updateNotificationSettings = async (req, res) => {
    try {

        const user = await User.findByIdAndUpdate(
            req.params.id, {
                notificationSettings: req.body,
            },
            {
                new: true,
            }
        );

        if(!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }
        res.status(200).json(user);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Notification settings could not be updated"
        });

    }
};

export const deleteAccount = async (req, res) => {
    try {

        const { password } = req.body;

        const user = await User.findById(req.params.id);

        if(!user) {
            return res.status(404).json({
                message: "User not found."
            })
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch) {
            return res.status(400).json({
                message: "Incorrect password."
            })
        }

        await Post.deleteMany({
            author: user._id
        });

        await User.findByIdAndDelete(user._id);

        res.status(200).json({
            message: "Account deleted successfully."
        });
        
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Account could not be delete"
        })
    }
}

export const changeEmail = async (req, res) => {
    
}

export const updatePrivacySettings = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {privacy: req.body}, {new: true,});

        res.status(200).json({
            message: "Privacy settings updated successfully.",
            privacy: user.privacy,
        });
    } catch(error) {
        console.error(error);

        res.status(500).json({
            message: "Privacy settings could not be updated.",
        });
    }
}

export const updateLanguage = async (req, res) => {
    try {

        const { language } = req.body;

        if(!["en", "tr"].includes(language)) {
            return res.status(400).json({
                message: "Invalid language",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { language },
            { new: true }
        );

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Could not update language.",
        });
    }
}