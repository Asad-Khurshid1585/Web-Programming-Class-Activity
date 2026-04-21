const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SESSION_SECRET || 'loginSystemSecret2024';

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: SECRET,                     // Secret key to sign the session ID
    resave: false,                      // Do not save session if unmodified
    saveUninitialized: false,           // Do not create session until data is set
    cookie: {
        secure: false,                  // Set to true when using HTTPS in production
        maxAge: 1000 * 60 * 60          // Session expires after 1 hour
    }
}));

// ─── Static Files ────────────────────────────────────────────────────────────
app.use(express.static('public'));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/', authRoutes);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
