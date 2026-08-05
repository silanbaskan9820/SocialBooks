import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import userBookRoutes from "./routes/userBookRoutes.js"
import path from "path";
import { connectDB } from "./config/db.js";
import { loggerMiddleware } from "./middleware/loggerMiddleware.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { optionalAuthMiddleware } from "./middleware/optionalAuthMiddleware.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { notFoundMiddleware } from "./middleware/notFoundMiddleware.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5002

connectDB();

//console.log("CORS:", [
//  "http://localhost:5173",
  //"https://social-books.vercel.app"
//]);

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://social-books.vercel.app"
    ],
    credentials: true,
}));

app.use(express.json()); 

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/user-books", userBookRoutes)

app.listen(PORT, () => {
    //console.log("Server started on PORT:", PORT);
});
