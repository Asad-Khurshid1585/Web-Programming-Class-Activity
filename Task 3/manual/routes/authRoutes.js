const express = require('express');
const router = express.Router();

const { User } = require('../models/User');
const isAuthenticated = require('../middleware/auth');

// ─── POST /register ──────────────────────────────────────────────────────────

/**
 * Register a new user.
 * Body: { username, password }
 * Response: { message: 'User registered successfully' }
 */
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = new User(username, password);
        const result = await user.register();
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ─── POST /login ─────────────────────────────────────────────────────────────

/**
 * Login with existing credentials.
 * Body: { username, password }
 * Creates session on success.
 * Response: { message: 'Login successful' }
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = new User(username, password);
        const result = await user.login();

        // Store username in session
        req.session.user = result.username;

        res.json({ message: result.message });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
});

// ─── GET /dashboard (Protected) ──────────────────────────────────────────────

/**
 * Protected dashboard route.
 * Requires an active session.
 * Response: { message: 'Welcome <username>' }
 */
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.json({ message: `Welcome ${req.session.user}` });
});

// ─── GET /logout ─────────────────────────────────────────────────────────────

/**
 * Logout the current user by destroying the session.
 * Response: { message: 'Logout successful' }
 */
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

module.exports = router;
