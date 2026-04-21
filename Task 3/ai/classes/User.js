const UserModel = require("../models/UserModel");

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async register() {
    const existingUser = await UserModel.findOne({ username: this.username });

    if (existingUser) {
      return {
        success: false,
        message: "Username already exists",
      };
    }

    const newUser = new UserModel({
      username: this.username,
      password: this.password,
    });

    await newUser.save();

    return {
      success: true,
      message: "User registered successfully",
    };
  }

  async login() {
    const user = await UserModel.findOne({
      username: this.username,
      password: this.password,
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }

    return {
      success: true,
      message: "Login successful",
      user,
    };
  }
}

module.exports = User;
