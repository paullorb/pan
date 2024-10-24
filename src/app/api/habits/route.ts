// /api/habits/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Habit from '../../lib/models/habit';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

// Helper function to verify token and get userId
const getUserIdFromToken = (token: string | undefined): string | null => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

// Helper function to validate and parse date
const validateDate = (dateStr: string | null): Date | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

export async function GET(request: Request) {
  try {
    await connectDB();

    // Auth check
    const token = request.headers.get('authorization')?.split(' ')[1];
    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Date validation
    const { searchParams } = new URL(request.url);
    const date = validateDate(searchParams.get('date'));
    if (!date) {
      return NextResponse.json({ error: 'Invalid date parameter' }, { status: 400 });
    }

    const dateStr = date.toISOString().split('T')[0];
    const today = new Date();

    // Try to find existing habits
    let habitDoc = await Habit.findOne({ 
      userId: new Types.ObjectId(userId), 
      date: dateStr 
    });

    if (!habitDoc) {
      if (date <= today) {
        // Get habits from previous day
        const yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const prevHabits = await Habit.findOne({
          userId: new Types.ObjectId(userId),
          date: yesterdayStr
        });

        // Create new habit document
        habitDoc = new Habit({
          userId: new Types.ObjectId(userId),
          date: dateStr,
          habits: prevHabits 
            ? prevHabits.habits.map((h: { name: any; }) => ({ name: h.name, completed: false }))
            : []
        });
        
        await habitDoc.save();
      } else {
        // For future dates, return today's habits uncompleted
        const todayStr = today.toISOString().split('T')[0];
        const currentHabits = await Habit.findOne({
          userId: new Types.ObjectId(userId),
          date: todayStr
        });

        if (currentHabits) {
          return NextResponse.json({
            habits: currentHabits.habits.map((h: { name: any; }) => ({
              name: h.name,
              completed: false
            }))
          });
        }
      }
    }

    return NextResponse.json({ habits: habitDoc?.habits || [] });
  } catch (error) {
    console.error('GET /api/habits error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    // Auth check
    const token = request.headers.get('authorization')?.split(' ')[1];
    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const { habits, date } = await request.json();
    if (!Array.isArray(habits)) {
      return NextResponse.json({ error: 'Invalid habits format' }, { status: 400 });
    }

    const parsedDate = validateDate(date);
    if (!parsedDate) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    // Prevent future dates
    const today = new Date();
    if (parsedDate > today) {
      return NextResponse.json(
        { error: 'Cannot save habits for future dates' }, 
        { status: 400 }
      );
    }

    const dateStr = parsedDate.toISOString().split('T')[0];

    // Update or create habits
    await Habit.findOneAndUpdate(
      { 
        userId: new Types.ObjectId(userId), 
        date: dateStr 
      },
      { habits },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: 'Habits updated' });
  } catch (error) {
    console.error('POST /api/habits error:', error);
    if ((error as { code: number }).code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate entry for this date' }, 
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();

    // Auth check
    const token = request.headers.get('authorization')?.split(' ')[1];
    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const { date } = await request.json();
    const parsedDate = validateDate(date);
    if (!parsedDate) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const dateStr = parsedDate.toISOString().split('T')[0];

    // Delete habits
    await Habit.findOneAndDelete({ 
      userId: new Types.ObjectId(userId), 
      date: dateStr 
    });

    return NextResponse.json({ message: 'Habits deleted' });
  } catch (error) {
    console.error('DELETE /api/habits error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}