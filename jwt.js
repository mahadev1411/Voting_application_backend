const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET from .env
        req.user = decoded; // Attach user information to the request object
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ error: 'Invalid token' });
    }
};

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' }); // Signed with JWT_SECRET
};

module.exports = { authMiddleware, generateToken };
