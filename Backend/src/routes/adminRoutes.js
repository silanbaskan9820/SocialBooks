import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { 
    getDashboard, 
    getAllUsers,
    getUserDetail,
    updateUserRole,
    banUser,
} from "../controller/adminController.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, adminMiddleware, getDashboard);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, adminMiddleware, getUserDetail);
router.patch("/users/:id/role", authMiddleware,adminMiddleware, updateUserRole);
router.patch("/users/:id/ban", authMiddleware, adminMiddleware, banUser);

export default router;