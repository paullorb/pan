// app/api/toggles/route.ts

import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Toggle from '../../lib/models/Toggle';
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

    const togglesDoc = await Toggle.findOne({ userId });

    if (!togglesDoc) {
      // If no toggles are stored for the user, return default toggles
      return NextResponse.json({
        togglesState: {
          hours: false,
          priorities: false,
          tasks: false,
          month: false,
          date: false,
          momentum: false,
        },
      }, { status: 200 });
    }

    return NextResponse.json({ togglesState: togglesDoc.togglesState }, { status: 200 });
  } catch (error) {
    console.error('GET /api/toggles error:', error);
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
    const { togglesState } = body;

    if (!togglesState) {
      return NextResponse.json({ error: 'togglesState is required' }, { status: 400 });
    }

    // Upsert the toggles document for the user
    await Toggle.findOneAndUpdate(
      { userId },
      { togglesState },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: 'Toggles state updated' }, { status: 200 });
  } catch (error) {
    console.error('POST /api/toggles error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
