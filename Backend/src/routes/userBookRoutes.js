import express from "express";
import {
    addBookToUser,
    getReadingBooks,
    getWishlistBooks,
    getLibraryBooks,
    updateBookStatus,
    updateReadingProgress,
    deleteBook,
    updateCurrentPage,
    markBookAsComplete,
    getCompletedBooks
} from "../controller/userBookController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addBookToUser);
router.get("/reading", authMiddleware, getReadingBooks);
router.get("/wishlist", authMiddleware, getWishlistBooks);
router.get("/library", authMiddleware, getLibraryBooks);
router.patch("/:id/status", authMiddleware, updateBookStatus);
router.patch("/:id/progress", authMiddleware, updateReadingProgress);
router.delete("/:id", authMiddleware, deleteBook);
router.put("/:id/page", authMiddleware, updateCurrentPage);
router.put("/:id/complete", authMiddleware, markBookAsComplete);
router.get("/completed", authMiddleware, getCompletedBooks);

export default router;