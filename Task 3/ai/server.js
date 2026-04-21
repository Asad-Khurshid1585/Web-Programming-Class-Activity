require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");

const connectDB = require("./config/db");
const User = require("./classes/User");
const isAuthenticated = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api", (req, res) => {
  return res.json({
    message: "Login System API running",
    routes: ["POST /register", "POST /login", "GET /dashboard", "GET /logout"],
  });
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = new User(username, password);
    const result = await user.register();

    if (!result.success) {
      return res.status(409).json({ message: result.message });
    }

    return res.status(201).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = new User(username, password);
    const result = await user.login();

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    req.session.user = result.user.username;

    return res.json({ message: result.message });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/dashboard", isAuthenticated, (req, res) => {
  return res.json({ message: `Welcome ${req.session.user}` });
});

app.get("/logout", (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ message: "No active session" });
  }

  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: "Could not logout" });
    }

    return res.json({ message: "Logout successful" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
