import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectDB from '../../lib/mongodb';
import Tag from '../../lib/models/Tag';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const tags = await Tag.find({ userId: decoded.userId });
    
    return NextResponse.json({ success: true, data: tags });
  } catch (error) {
    console.error('GET /api/tags error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const tagName = body.name;

    if (!tagName) {
      return NextResponse.json({ success: false, error: 'Tag name is required' }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    
    const newTag = await Tag.create({
      userId: decoded.userId,
      name: tagName
    });

    return NextResponse.json({ success: true, data: newTag });
  } catch (error) {
    console.error('POST /api/tags error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}