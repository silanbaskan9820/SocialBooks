export function validateRegister(req, res, next) {

    const { username, name, surname, email, password } = req.body;

    if (!username) {
        return res.status(400).json({
            message: "Username is required"
        });
    }
    
    if (!name) {
        return res.status(400).json({
            message: "Name is required"
        });
    }
    
    if (!surname) {
        return res.status(400).json({
            message: "Surname is required"
        });
    }
    
    if (!email) {
        return res.status(400).json({
            message: "E-mail is required"
        });
    }
    
    if (!password) {
        return res.status(400).json({
            message: "Password is required"
        });
    }
    
    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long"
        });
    }
    
    next();
}

export function validateLogin(req,res,next) {
    
    const {email, password} = req.body;

    if(!email) {
        return res.status(400).json({
            message: "E-mail is required"
        });
    }
    if(!password) {
        return res.status(400).json({
            message: "Password is required"
        });
    }
    next();
}