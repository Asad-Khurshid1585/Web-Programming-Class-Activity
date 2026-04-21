# Task 3 - Login System

## Tech Stack
- Express.js
- MongoDB (Mongoose)
- express-session
- JavaScript Class

## Features
- Register user: `POST /register`
- Login user: `POST /login`
- Protected dashboard: `GET /dashboard`
- Logout user: `GET /logout`

## Project Structure
- `server.js` - Main Express server and routes
- `config/db.js` - MongoDB connection code
- `models/UserModel.js` - Mongoose user model (`users` collection)
- `classes/User.js` - User class with `register()` and `login()`
- `middleware/auth.js` - Authentication middleware

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example` and set values.
3. Run app:
   ```bash
   npm run dev
   ```

## Docker Setup
1. Build and run app + MongoDB:
   ```bash
   docker compose up --build
   ```
2. API available at `http://localhost:3000`

## Sample Requests
### Register
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"asad","password":"12345"}'
```

### Login
```bash
curl -i -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"asad","password":"12345"}'
```

### Dashboard (with session cookie)
Use the cookie returned from login request.

### Logout
```bash
curl http://localhost:3000/logout
```

## Suggested Git Commits
```bash
git init
git add .
git commit -m "Initial project setup with Express server"
git commit -m "Added MongoDB connection using Mongoose"
git commit -m "Created User class with register and login methods"
git commit -m "Implemented login and register routes with sessions"
git commit -m "Added protected dashboard route and auth middleware"
git commit -m "Implemented logout functionality"
git commit -m "Dockerized application with docker-compose"
```
