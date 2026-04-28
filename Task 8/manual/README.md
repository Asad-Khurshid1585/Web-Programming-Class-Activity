# Auth App

A complete authentication system built with Next.js, MongoDB, and Docker.

## Features

- User registration (signup)
- User login with secure password hashing
- Protected dashboard
- Session management with cookies
- Logout functionality
- Docker containerization

## Tech Stack

- Next.js (App Router)
- MongoDB
- Mongoose
- bcrypt for password hashing
- Tailwind CSS for styling
- Docker & Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose installed

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Run the application with Docker:

```bash
docker-compose up --build
```

The application will be available at http://localhost:3000

### Manual Setup (without Docker)

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB locally on port 27017

3. Update `.env.local` to use `mongodb://localhost:27017/authapp`

4. Run the development server:
```bash
npm run dev
```

## Project Structure

- `app/` - Next.js app router pages
  - `page.tsx` - Home page
  - `signup/` - Signup functionality
  - `login/` - Login functionality
  - `dashboard/` - Protected dashboard
- `lib/` - Utility functions
  - `db.ts` - MongoDB connection
  - `models/User.ts` - User schema
- `Dockerfile` - Docker configuration
- `docker-compose.yml` - Docker Compose setup

## Usage

1. Visit the home page
2. Click "Sign Up" to create an account
3. After signup, log in with your credentials
4. Access the protected dashboard
5. Logout when done

## Security Features

- Password hashing with bcrypt
- Session management with HTTP-only cookies
- Input validation
- Duplicate email prevention
- Secure cookie settings in production

## Footer

© 2026 🔐 SecureAuth Inc. All rights reserved.