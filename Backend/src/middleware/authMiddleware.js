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
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);

        if(!user) {
            return res.status(404).json({
                message:"User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            message:"Invalid token"
        });
    }
}