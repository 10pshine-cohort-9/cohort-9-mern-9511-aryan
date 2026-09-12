const mongoose = require('mongoose');

before(async function () {
  this.timeout(10000);
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret_key_12345';
  process.env.PORT = '5001';

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/track_box_test';
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000
      });
    }
  } catch (err) {
    throw new Error(`Test database connection failed: ${err.message}`);
  }
});

after(async function () {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
});
