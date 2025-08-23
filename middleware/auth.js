const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    try {
        // Remove 'Bearer ' prefix if present
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

        // Verify the token using user-specific secret
        const decoded = jwt.verify(cleanToken, process.env.JWT_USER_SECRET);

        // Add user info to request object
        req.userId = decoded.userId;
        req.userEmail = decoded.email;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

function adminMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    try {
        // Remove 'Bearer ' prefix if present
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

        // Verify the token using admin-specific secret
        const decoded = jwt.verify(cleanToken, process.env.JWT_ADMIN_SECRET);

        // Add admin info to request object
        req.adminId = decoded.adminId;
        req.adminEmail = decoded.email;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = {
    userMiddleware,
    adminMiddleware
}
