const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    // Check if token exists
    if (!authHeader) {
        return res.status(401).json({ message: "No token, access denied" });
    }

    // Remove "Bearer " if you are using Bearer tokens
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        req.user = verified; // attach user data to request
        next(); // continue to next function
    } catch (err) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;