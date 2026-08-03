import express from "express";
import {createComment, updateComment, deleteComment, getCommentsByPost, likeComment} from "../controller/commentController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {validateContent} from "../validation/commentValidation.js"

const router = express.Router();

router.post("/createComment", authMiddleware, validateContent, createComment);
router.put("/:id", authMiddleware, validateContent, updateComment);
router.delete("/:id", authMiddleware, deleteComment);
router.get("/post/:postId", getCommentsByPost);
router.put("/:id/like", authMiddleware, likeComment);

export default router;