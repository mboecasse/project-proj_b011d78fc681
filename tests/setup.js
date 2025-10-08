// File: tests/setup.js
// Generated: 2025-10-08 11:51:07 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_yvubaicdgp4i


const mongoose = require('mongoose');

const { MongoMemoryServer } = require('mongodb-memory-server');


let mongoServer;

module.exports = async () => {
  if (process.env.NODE_ENV === 'test') {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    global.__MONGOSERVER__ = mongoServer;
  }
};

afterAll(async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});
