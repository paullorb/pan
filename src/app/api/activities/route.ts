// /api/activities/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Activity from '../../lib/models/Activity';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    // Get the user's token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    // Parse the URL to get the date query parameter
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    await connectDB();

    // Find activities for the user and date
    const activities = await Activity.findOne({ userId: decoded.userId, date });

    return NextResponse.json({ activities: activities ? activities.activities : {} }, { status: 200 });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Get the user's token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    const { date, activities } = await request.json();

    if (!date || !activities) {
      return NextResponse.json({ error: 'Date and activities are required' }, { status: 400 });
    }

    await connectDB();

    // Upsert activities for the user and date
    await Activity.findOneAndUpdate(
      { userId: decoded.userId, date },
      { activities },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Activities saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving activities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
