import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// 獲取所有用戶
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({});
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// 創建新用戶
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('收到創建用戶請求:', body);
    
    await connectDB();
    const user = await User.create(body);
    console.log('用戶創建成功:', user);
    
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('創建用戶失敗:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 