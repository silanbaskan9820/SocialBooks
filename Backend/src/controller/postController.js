import Post from "../models/Post.js";
import Notification from "../models/Notification.js"
import User from "../models/User.js"

export async function getAllPost(req, res) {
   try {

    const posts = await Post.find()
    .populate("author", "username name surname profileImage")
    .populate("likes", "username profileImage")
    .sort({ createdAt: -1});

    res.status(200).json(posts);
   } catch (error){
    console.error("Error in getAllPost controller", error);
    res.status(500).json({
        message: "Internal server error"
    });
   }
}

export async function createPost(req,res) {
   try {
        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            image: req.body.image,
            author: req.user._id
   });

        res.status(201).json(post);
    } catch (error) {
        console.error("Error in createPost controller", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function updatePost(req, res) {
    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this post"
            });
        }

        if (req.body.title) {
            post.title = req.body.title;
        }

        if (req.body.content) {
            post.content = req.body.content;
        }

        if(req.body.image !== undefined) {
            post.image = req.body.image;
        }

        await post.save();

        res.status(200).json(post);
    } catch (error) {
        console.error("Error in updatePost controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });

    }
}

export async function deletePost(req,res) {
     try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this post"
            });
        }
        await post.deleteOne();
        
        res.status(200).json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error("Error in deletePost controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function likePost(req,res) {
    try {
        const post = await Post.findById(req.params.id);

        /*console.log("User:", req.user);
        console.log("User ID:", req.user._id);
        console.log("Likes before:", post.likes);*/

        if(!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const alreadyLiked = post.likes.some(
            like => like.toString() === req.user._id.toString()     
        );

        let message;

        if(alreadyLiked) {
            post.likes = post.likes.filter(
                like => like.toString() !== req.user._id.toString()
            );
                message = "Post unliked successfully";
        } else {
            post.likes.push(req.user._id);
            //console.log("Likes after push:", post.likes);
                message = "Post liked successfully";
        }

        await post.save();
        //console.log("Likes after save:", post.likes);

        if(!alreadyLiked && post.author.toString() !== req.user._id.toString())
        { await Notification.create({
            recipient: post.author,
            sender: req.user._id,
            type: "like",
            post: post._id,
        });
    }

        res.status(200).json({
                message,
                likesCount: post.likes.length,
                liked: !alreadyLiked
            });
        } catch (error) {
            console.error("Error in likePost controller", error);
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }

export async function getPostById(req, res) {
    try {
        console.log("req.user:", req.user);
         const post = await Post.findById(req.params.id)
         .populate("author", "username profileImage") // görüntüleyen kullanıcı
         .populate("likes","username profileImage"); // beğenen kullanıcı

         if(!post) {
            return res.status(404).json({
                message: "Post not found"
            });
         }

         if (req.user) {
             const alreadyViewed = post.viewedBy.some(
            view => view.toString() === req.user._id.toString()
         );

         if (!alreadyViewed) {
            post.views++;
            post.viewedBy.push(req.user._id);
            
            await post.save();
         }
        }

        const liked = req.user
    ? post.likes.some(
        like => like._id.toString() === req.user._id.toString()
      )
    : false;
        
        res.status(200).json({
            post,
            likes: post.likes.length,
            liked,
            views: post.views
        });
    } catch (error) {
        console.error("Error in getPostById controller", error);
        
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function searchPosts(req,res) {
    try {
    
        const {query} = req.query; 

         if(!query) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const posts = await Post.find({
            $or: [
                {
                    title: {
                        $regex: query,
                        $options: "i"
                    }
                },
                {
                    content: {
                        $regex: query,
                        $options: "i"
                    }
                }
            ]
        })
        .populate("author", "username profileImage")
        .populate("likes", "username profileImage")
        .sort({ createdAt: -1});

        res.status(200).json(posts);
    } catch(error) {
        console.error("Error in searchPosts controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
