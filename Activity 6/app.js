const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Mount user routes
const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Express API. Use /api/users for user operations." });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
