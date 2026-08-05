export function loggerMiddleware(req, res, next) {

    //console.log("Method:", req.method);
    //console.log("URL:", req.originalUrl);

    next();
}