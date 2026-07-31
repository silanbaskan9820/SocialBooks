export function validateContent(req, res, next) {

    const {content} = req.body;

    if(!content) {
        return res.status(400).json({
            message: "Content is required"
        });
    }

    if(content.length < 2) {
        return res.status(400).json({
            message: "Content must be at least 2 characters long"
        });
    }
    next();
}