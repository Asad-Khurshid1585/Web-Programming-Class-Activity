const express = require("express");
const router = express.Router();

// In-memory data store (simulating a database)
let users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { id: 2, name: "Bob Smith",    email: "bob@example.com" },
];
let nextId = 3;

// GET /api/users — retrieve all users
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// GET /api/users/:id — retrieve a single user by ID
router.get("/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({ success: true, data: user });
});

// POST /api/users — create a new user
router.post("/", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Name and email are required" });
  }

  const newUser = { id: nextId++, name, email };
  users.push(newUser);

  res.status(201).json({ success: true, message: "User created", data: newUser });
});

// PUT /api/users/:id — update an existing user by ID
router.put("/:id", (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const { name, email } = req.body;

  if (!name && !email) {
    return res
      .status(400)
      .json({ success: false, message: "Provide at least name or email to update" });
  }

  users[index] = {
    ...users[index],
    ...(name  && { name }),
    ...(email && { email }),
  };

  res.status(200).json({ success: true, message: "User updated", data: users[index] });
});

// DELETE /api/users/:id — delete a user by ID
router.delete("/:id", (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const deleted = users.splice(index, 1)[0];

  res.status(200).json({ success: true, message: "User deleted", data: deleted });
});

module.exports = router;
