import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// 獲取單個用戶
export async function GET(request, { params }) {
  try {
    await connectDB();
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ error: '用戶不存在' }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 更新用戶
export async function PUT(request, { params }) {
  try {
    const { name, email } = await request.json();
    await connectDB();
    const user = await User.findByIdAndUpdate(
      params.id,
      { name, email },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ error: '用戶不存在' }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 刪除用戶
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const user = await User.findByIdAndDelete(params.id);
    if (!user) {
      return NextResponse.json({ error: '用戶不存在' }, { status: 404 });
    }
    return NextResponse.json({ message: '用戶已刪除' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 