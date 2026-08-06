import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { 
    getDashboard, 
    getAllUsers,
    banUser,
} from "../controller/adminController.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, adminMiddleware, getDashboard);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.patch("/users/:id/ban", authMiddleware, adminMiddleware, banUser);

export default router;