import express from "express";
import {
    createBook,
    getAllBooks,
    getBookById,
    searchBooks,
} from "../controller/bookController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBook);
router.get("/", getAllBooks);
router.get("/search", searchBooks);
router.get("/:id", getBookById);

export default router;