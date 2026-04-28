# JWT Login Signup System

Simple Express API with JWT authentication for signup and login.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file from `.env.example` and set values:

```env
PORT=5000
JWT_SECRET=your_super_secret_key
```

3. Run the server:

```bash
npm run dev
```

## API Endpoints

- `POST /api/auth/signup`
  - Body: `{ "name": "Ali", "email": "ali@example.com", "password": "123456" }`

- `POST /api/auth/login`
  - Body: `{ "email": "ali@example.com", "password": "123456" }`

- `GET /api/auth/profile` (Protected)
  - Header: `Authorization: Bearer <token>`
