const bcrypt = require("bcryptjs");
const users = require("../data/users");
const generateToken = require("../utils/generateToken");

async function signup(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email, and password" });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword
  };

  users.push(user);

  const token = generateToken({ id: user.id, email: user.email, name: user.name });

  return res.status(201).json({
    message: "User created successfully",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  const user = users.find((item) => item.email === email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({ id: user.id, email: user.email, name: user.name });

  return res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
}

function getProfile(req, res) {
  return res.status(200).json({
    message: "Protected profile data",
    user: req.user
  });
}

module.exports = {
  signup,
  login,
  getProfile
};
