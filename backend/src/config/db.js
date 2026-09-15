const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryMongoServer;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI && process.env.MONGO_URI.trim();

    if (mongoUri) {
      try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (atlasError) {
        console.warn(`Atlas connection failed: ${atlasError.message}`);
        console.warn('Falling back to in-memory MongoDB for local development.');
      }
    }

    if (!memoryMongoServer) {
      memoryMongoServer = await MongoMemoryServer.create();
    }

    const conn = await mongoose.connect(memoryMongoServer.getUri(), {
      dbName: 'shoe-ecommerce',
    });

    console.log(`MongoDB Connected (memory): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
