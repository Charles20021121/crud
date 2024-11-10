import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;

if (!MONGODB_URI) {
  throw new Error('請在環境變量中設置MONGODB_URI');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      ssl: true,
      sslValidate: true,
      ...(process.env.PLATFORM === 'heroku' ? {
        retryWrites: false
      } : {}),
    };

    // 總是啟用調試日誌
    mongoose.set('debug', true);

    try {
      console.log('正在連接到MongoDB...');
      cached.promise = mongoose.connect(MONGODB_URI, opts);
      console.log('MongoDB連接成功');
    } catch (error) {
      console.error('MongoDB連接錯誤:', error);
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error('等待連接時出錯:', error);
    throw error;
  }

  return cached.conn;
}

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// 優雅關閉連接
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDB; 