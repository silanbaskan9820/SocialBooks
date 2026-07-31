import express from "express";
import { searchPosts, getAllPost, getPostById, createPost, likePost, updatePost, deletePost } from "../controller/postController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {validatePost} from "../validation/postValidation.js";
import { optionalAuthMiddleware } from "../middleware/optionalAuthMiddleware.js";

const router = express.Router();

router.get("/search", searchPosts);
router.get("/getAll", getAllPost);
router.get("/:id", optionalAuthMiddleware, getPostById);
router.post("/createPost", authMiddleware, validatePost, createPost);
router.put("/:id/like", authMiddleware, likePost);
router.put("/:id", authMiddleware, validatePost, updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
