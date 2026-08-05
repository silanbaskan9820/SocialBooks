import express from "express";
import {
    createBook,
    getAllBooks,
    searchOpenLibraryBooks,
    getBookById, 
} from "../controller/bookController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBook);
router.get("/", getAllBooks);
router.get("/search", authMiddleware, searchOpenLibraryBooks);
router.get("/:id", getBookById);
 

export default router;