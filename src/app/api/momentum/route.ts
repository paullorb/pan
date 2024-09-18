// app/api/momentum/route.ts

import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Habit from '../../lib/models/habit';
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

    const today = new Date();
    const requestedDate = new Date(date);

    let habitDoc = await Habit.findOne({ userId, date });

    if (!habitDoc) {
      if (requestedDate <= today) {
        // Fetch habits from the previous day
        const yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const previousHabits = await Habit.findOne({ userId, date: yesterdayStr });

        if (previousHabits) {
          // Copy habits from the previous day but set completed to false
          habitDoc = new Habit({
            userId,
            date,
            habits: previousHabits.habits.map((habit: { name: any; }) => ({
              name: habit.name,
              completed: false,
            })),
          });
          await habitDoc.save();
        } else {
          // If no previous habits, initialize with default habits
          habitDoc = new Habit({
            userId,
            date,
            habits: [
              { name: '🍞 Physio Übungen', completed: false },
              { name: '🍞 Duolingo', completed: false },
            ],
          });
          await habitDoc.save();
        }
      } else {
        // For future dates, do not create a document; return habits from today or last available date
        const todayStr = today.toISOString().split('T')[0];
        const lastAvailableHabits = await Habit.findOne({ userId, date: todayStr }) ||
          (await Habit.findOne({ userId }).sort({ date: -1 }).limit(1));

        habitDoc = {
          userId,
          date,
          habits: lastAvailableHabits
            ? lastAvailableHabits.habits.map((habit) => ({
                name: habit.name,
                completed: false,
              }))
            : [
                { name: '🍞 Physio Übungen', completed: false },
                { name: '🍞 Duolingo', completed: false },
              ],
        };
      }
    }

    return NextResponse.json({ habits: habitDoc.habits }, { status: 200 });
  } catch (error) {
    console.error('GET /api/momentum error:', error);
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
    const { habits, date } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const today = new Date();
    const requestedDate = new Date(date);

    if (requestedDate > today) {
      return NextResponse.json({ error: 'Cannot save habits for future dates' }, { status: 400 });
    }

    // Upsert the habit document for the user and date
    await Habit.findOneAndUpdate(
      { userId, date },
      { habits },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: 'Habits updated' }, { status: 200 });
  } catch (error) {
    console.error('POST /api/momentum error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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
    const { date } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Delete the habit document for the user and date
    await Habit.findOneAndDelete({ userId, date });

    return NextResponse.json({ message: 'Habits deleted' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/momentum error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
