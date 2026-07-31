export function validatePost(req, res, next) {

    const {title, content} = req.body;

    if(!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    if(title.length < 3){
        return res.status(400).json({
            message: "Title must be at least 3 characters long"
        });
    }

    if(!content) {
        return res.status(400).json({
            message: "Content is required"
        });
    }

    if(content.length < 10) {
        return res.status(400).json({
            message: "Content must be at least 10 characters long"
        });
    }
    
    next();
}