import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getNotifications } from "../controller/notificationController.js";
import { markNotificationAsRead } from "../controller/notificationController.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.put("/:id/read", authMiddleware, markNotificationAsRead);
 
export default router;