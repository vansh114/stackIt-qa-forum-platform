const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided!" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.user.id).select('-password');
        if (!user || user.isDeleted) {
            return res.status(403).json({ error: "Access denied. User account is inactive or deleted." });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token!" });
    }
};

module.exports = fetchUser;
