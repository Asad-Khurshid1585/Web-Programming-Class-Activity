const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Mongoose Schema & Model ────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

const UserModel = mongoose.model('User', userSchema);

// ─── User Class ─────────────────────────────────────────────────────────────

/**
 * Represents a user in the login system.
 * Provides register and login functionality backed by MongoDB.
 */
class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    /**
     * Registers a new user by saving their hashed password to the database.
     * Throws an error if the username is already taken.
     * @returns {Promise<{message: string}>}
     */
    async register() {
        const existingUser = await UserModel.findOne({ username: this.username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);

        const newUser = new UserModel({
            username: this.username,
            password: hashedPassword
        });

        await newUser.save();
        return { message: 'User registered successfully' };
    }

    /**
     * Validates credentials against the database.
     * Throws an error if the user is not found or the password is incorrect.
     * @returns {Promise<{message: string, username: string}>}
     */
    async login() {
        const user = await UserModel.findOne({ username: this.username });
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(this.password, user.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        return { message: 'Login successful', username: user.username };
    }
}

module.exports = { User, UserModel };
