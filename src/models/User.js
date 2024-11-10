import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '請輸入姓名'],
    trim: true,
    minlength: [2, '姓名至少需要2個字符'],
  },
  email: {
    type: String,
    required: [true, '請輸入郵箱'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '請輸入有效的郵箱地址']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 防止重複編譯模型
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User; 