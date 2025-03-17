const rateLimit = require("express-rate-limit");

// Define rate limit rule for login
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 2, // Allow 5 login attempts per 1 minutes
    message: "Too many login attempts. Please try again later.",
    headers: true,
});

module.exports = { loginLimiter };
