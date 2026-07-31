import express from "express";
import {
        searchUsers, 
        registerUser, 
        loginUser, 
        getUser, 
        updateUser, 
        followUser, 
        updateProfilePhoto, 
        changePassword, 
        updateNotificationSettings, 
        deleteAccount, 
        changeEmail,
        updatePrivacySettings,
        updateLanguage
} from "../controller/userController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {
        validateRegister, 
        validateLogin
} from "../validation/userValidation.js";
import upload from "../middleware/uploadMiddleware.js"

const router = express.Router();

router.get("/search", searchUsers)
router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/:id/follow", authMiddleware, followUser);
router.get("/:id", getUser);
router.put("/:id", authMiddleware, updateUser);
router.put("/:id/photo", authMiddleware, upload.single("profileImage"), updateProfilePhoto);
router.put("/change-password", authMiddleware, changePassword);
router.put("/:id/notifications", authMiddleware, updateNotificationSettings);
router.delete("/:id", authMiddleware, deleteAccount);
router.put("/change-email", authMiddleware, changeEmail);
router.put("/:id/privacy", authMiddleware, updatePrivacySettings);
router.put("/:id/language", authMiddleware, updateLanguage);

export default router;