import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";

export async function createComment(req, res) {
    try {
        const comment = await Comment.create({
            content: req.body.content,
            post: req.body.post,
            author: req.user._id
        });

        const post = await Post.findById(req.body.post);

        if (post.author.toString() !== req.user._id.toString()) {
            await Notification.create({
                recipient: post.author,
                sender: req.user._id,
                type: "comment",
                post: post._id,
            })
        }
        
        res.status(201).json(comment);
    } catch (error) {
       console.error("Error in createComment controller", error);

       res.status(500).json({
        message: "Internal server error"
    }); 
    } 
}

export async function updateComment(req,res) {
    try {
        const comment = await Comment.findById(req.params.id);

       if(!comment) {
            return res.status(404).json({message: "Comment not found"});
        }
        if(comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this comment"
            });
        }

        comment.content = req.body.content; // eski yorumu yenisiyle değiştirir
        await comment.save(); // yapılan değişikliği kaydeder. await ise işlemin tamamlanmasını bekler, işlemin bug'a girmesini engeller.

        res.status(200).json(comment);
    } catch (error) {
        console.error("Error in updateComment controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function deleteComment(req,res) {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if(comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this comment"
            });
        }

        await comment.deleteOne();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error in deleteComment controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function getCommentsByPost(req,res) {
   try {
        const comments = await Comment.find(
            {post: req.params.postId})
            .populate("author", "username profileImage")
            .populate("post","title")
            .sort({ createdAt: -1 });
            //populate verileri tek seferde gösterir

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error in getCommentsByPost controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function likeComment(req, res) {
    try {
         const comment = await Comment.findById(req.params.id);
         const userId = req.user.id;
        
                if(!comment) {
                    return res.status(404).json({
                        message: "Comment not found"
                    });
                }
        
                const alreadyLiked = comment.likes.some(
                    like => like.toString() === req.user._id.toString()     
                );
        
                let message;
        
                if(alreadyLiked) {
                    comment.likes = comment.likes.filter(
                        like => like.toString() !== req.user._id.toString()
                    );
                        message = "Comment unliked successfully";
                } else {
                    comment.likes.push(req.user._id);
                        message = "Comment liked successfully";
                }
        
                await comment.save();
        
                if(!alreadyLiked && comment.author.toString() !== req.user._id.toString())
                { await Notification.create({
                    recipient: comment.author,
                    sender: req.user._id,
                    type: "like",
                    post: comment.post,
                });
            }
        
                res.status(200).json({
                        message,
                        likesCount: comment.likes.length,
                        liked: !alreadyLiked
                    });
    } catch (error) {
        console.error("Error in likeComment controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
