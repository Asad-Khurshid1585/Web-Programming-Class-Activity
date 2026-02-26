const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB Connection URI
const MONGO_USER = encodeURIComponent(process.env.MONGO_INITDB_ROOT_USERNAME);
const MONGO_PASSWORD = encodeURIComponent(process.env.MONGO_INITDB_ROOT_PASSWORD);
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_INITDB_DATABASE;

const mongoUri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

let db;
let client;

// Connect to MongoDB
async function connectToMongo() {
  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db(MONGO_DB);
    console.log('✓ Connected to MongoDB successfully');
  } catch (error) {
    console.error('✗ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Get all items from a collection
app.get('/api/items', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    
    const collection = db.collection('items');
    const items = await collection.find({}).toArray();
    res.json({ count: items.length, items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new item
app.post('/api/items', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const collection = db.collection('items');
    const result = await collection.insertOne({
      name,
      description: description || '',
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'Item created successfully',
      id: result.insertedId,
      item: { name, description, createdAt: new Date() }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get item by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    
    const { ObjectId } = require('mongodb');
    const collection = db.collection('items');
    const item = await collection.findOne({ _id: new ObjectId(req.params.id) });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an item
app.put('/api/items/:id', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    
    const { ObjectId } = require('mongodb');
    const { name, description } = req.body;
    const collection = db.collection('items');

    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, description, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item updated successfully', modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    
    const { ObjectId } = require('mongodb');
    const collection = db.collection('items');
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get database stats
app.get('/api/stats', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    
    const stats = await db.stats();
    res.json({ database: MONGO_DB, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
async function startServer() {
  await connectToMongo();

  app.listen(PORT, () => {
    console.log(`
═══════════════════════════════════════════════════════════
  Express Server Running on http://localhost:${PORT}
  Connected to MongoDB: ${MONGO_DB}
═══════════════════════════════════════════════════════════

Available Endpoints:
  GET    /api/health           - Server status
  GET    /api/items            - Get all items
  POST   /api/items            - Create new item
  GET    /api/items/:id        - Get item by ID
  PUT    /api/items/:id        - Update item
  DELETE /api/items/:id        - Delete item
  GET    /api/stats            - Database statistics
    `);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
