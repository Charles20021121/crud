import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    '環境變量MONGODB_URI未設置。' +
    '請在Vercel儀表板中的Settings -> Environment Variables中添加此變量。' +
    '當前環境變量：' + JSON.stringify(process.env, null, 2)
  );
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