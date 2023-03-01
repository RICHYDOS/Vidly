module.exports = function (req, res, next) {
    // 401 - Unauthorized: User tries to access a protected resource without the valid jwt
    // 403 - Forbidden: If the user is valid and all but is not meant to be able to access that protected resource

    if (!req.user.isAdmin) res.status(403).send("Access Denied");
    next();
}