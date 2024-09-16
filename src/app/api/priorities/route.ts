import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Priority from '../../lib/models/Priority';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId;
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Extract date from query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    const priority = await Priority.findOne({ userId, date });
    const priorities = priority ? priority.priorities : ['', '', ''];

    return NextResponse.json({ priorities }, { status: 200 });
  } catch (error) {
    console.error('GET /api/priorities error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId;
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { priorities, date } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Upsert the priority document for the user and date
    await Priority.findOneAndUpdate(
      { userId, date },
      { priorities },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: 'Priorities updated' }, { status: 200 });
  } catch (error) {
    console.error('POST /api/priorities error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
