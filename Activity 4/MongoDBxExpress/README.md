# MongoDB + Express App

A simple Express.js application connected to MongoDB running in Docker.

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- MongoDB running in Docker (from the docker-compose.yml in the MongoDB folder)

## Setup Instructions

### 1. Start MongoDB in Docker

From the `MongoDB` folder, run:
```bash
docker-compose up -d
```

This will start MongoDB on `localhost:27017` with the credentials from the `.env` file.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

The `.env` file is already configured with:
- `MONGO_INITDB_ROOT_USERNAME=admin`
- `MONGO_INITDB_ROOT_PASSWORD=password`
- `MONGO_INITDB_DATABASE=myapp`
- `PORT=3000`

**Note:** Make sure these match the values in the MongoDB `docker-compose.yml` file.

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if server is running

### Items (CRUD Operations)
- **GET** `/api/items` - Get all items
- **POST** `/api/items` - Create a new item
  - Body: `{ "name": "Item name", "description": "Item description" }`
- **GET** `/api/items/:id` - Get item by ID
- **PUT** `/api/items/:id` - Update item by ID
  - Body: `{ "name": "Updated name", "description": "Updated description" }`
- **DELETE** `/api/items/:id` - Delete item by ID

### Statistics
- **GET** `/api/stats` - Get database statistics

## Testing with cURL

```bash
# Check health
curl http://localhost:3000/api/health

# Create an item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"This is a test"}'

# Get all items
curl http://localhost:3000/api/items

# Get specific item (replace with actual ID)
curl http://localhost:3000/api/items/ITEM_ID

# Update item
curl -X PUT http://localhost:3000/api/items/ITEM_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Item","description":"Updated description"}'

# Delete item
curl -X DELETE http://localhost:3000/api/items/ITEM_ID
```

## Troubleshooting

### Connection Error
If you get a MongoDB connection error:
1. Verify MongoDB is running: `docker ps` (should show mongo-local)
2. Check the credentials in `.env` match the docker-compose.yml
3. Ensure port 27017 is not blocked

### Module Not Found
Make sure you've run `npm install` before starting the server.

## Project Structure

```
├── server.js          - Main Express server with MongoDB connection
├── package.json       - Dependencies and scripts
├── .env              - Environment variables
└── README.md         - This file
```

## Dependencies

- **express** - Web framework
- **mongodb** - MongoDB driver
- **dotenv** - Environment variable manager
- **nodemon** (dev) - Auto-reload during development
