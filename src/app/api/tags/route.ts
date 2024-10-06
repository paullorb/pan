import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectDB from '../../lib/mongodb';
import Tag, { ITag } from '../../lib/models/Tag';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch tags for the user
    const tags = await Tag.find({ userId });

    return NextResponse.json({ tags }, { status: 200 });
  } catch (error) {
    console.error('GET /api/tags error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { tags } = await request.json();

    if (!Array.isArray(tags)) {
      return NextResponse.json({ error: 'Tags must be an array' }, { status: 400 });
    }

    // Remove existing tags for the user
    await Tag.deleteMany({ userId });

    // Add new tags
    const newTags = tags.map((tag: any) => ({
      userId,
      name: tag.name,
      color: tag.color,
      count: tag.count || 0,
    }));

    await Tag.insertMany(newTags);

    return NextResponse.json({ message: 'Tags saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('POST /api/tags error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Delete all tags for the user
    await Tag.deleteMany({ userId });

    return NextResponse.json({ message: 'Tags deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/tags error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
