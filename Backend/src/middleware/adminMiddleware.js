export function adminMiddleware (req, res, next) {

    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }

    if (
        req.user.role !== "admin" &&
        req.user.role !== "superadmin"
    ) {
        return res.status(403).json({
            message: "You are not authorized."
        });
    }

    next();
}