import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function optionalAuthMiddleware(req, res, next) {

    if(!req.headers.authorization) {
        return next();
    }
        const authHeader = req.headers.authorization;
        const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
        
        if (!token) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }
        
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );
            
            const user = await User.findById(decoded.id);
            
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            
            req.user = user;
            
            next();
        
        }catch (error) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }
    }