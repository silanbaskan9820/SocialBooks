import jwt from "jsonwebtoken";
import User from "../models/User.js"

export async function authMiddleware(req, res, next) {

    if (!req.headers.authorization) {
    return res.status(401).json({
        message: "Access denied"
    });
}

const authHeader = req.headers.authorization;
const token = authHeader.split(" ")[1];

    try {

        //console.log("Authorization:", req.headers.authorization);
        //console.log("Token:", token);
        //console.log("JWT_SECRET:", process.env.JWT_SECRET);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id).select("-password");

        if(!user) {
            return res.status(404).json({
                message:"User not found"
            });
        }

        if (user.isBanned) {
            return res.status(403).json({
                message: "Your account has been banned."
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error("JWT ERROR: ", error);

        return res.status(401).json({
            message: error.message,
        });
    }
}