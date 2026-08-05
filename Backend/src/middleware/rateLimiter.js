import "dotenv/config";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";


const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "20 s"),
    analytics: true,
});


export const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await ratelimit.limit(req.ip);

        if (!success) {
            return res.status(429).json({
                message: "Too many requests"
            });
        }

        next();

    } catch (error) {
        //console.log("Rate limiter error:", error);
        next();
    }
};