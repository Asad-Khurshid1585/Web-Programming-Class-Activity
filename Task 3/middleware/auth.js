/**
 * Authentication Middleware
 * Protects routes that require a logged-in session.
 * Redirects unauthenticated users with a 401 response.
 */
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized. Please login first.' });
};

module.exports = isAuthenticated;
