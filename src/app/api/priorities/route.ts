// /api/priorities/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Priority from '../../lib/models/Priority';
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

// Helper function to convert priorities array format
const formatPriorities = (priorities: any[]): string[] => {
  const result = ['', '', ''];
  priorities.forEach(p => {
    if (p.order >= 0 && p.order < 3) {
      result[p.order] = p.text || '';
    }
  });
  return result;
};

// Helper function to convert priorities to DB format
const toPriorityFormat = (priorities: string[]) => {
  return priorities.map((text, order) => ({
    text: text || '',
    order
  }));
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

    // Find priorities for the date
    const priority = await Priority.findOne({
      userId: new Types.ObjectId(userId),
      date: dateStr
    });

    // Return formatted priorities array
    const priorities = priority ? formatPriorities(priority.priorities) : ['', '', ''];

    return NextResponse.json({ priorities });
  } catch (error) {
    console.error('GET /api/priorities error:', error);
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
    const { priorities, date } = await request.json();
    
    if (!Array.isArray(priorities) || priorities.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid priorities format' },
        { status: 400 }
      );
    }

    const parsedDate = validateDate(date);
    if (!parsedDate) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    // Prevent future dates if needed
    // const today = new Date();
    // if (parsedDate > today) {
    //   return NextResponse.json(
    //     { error: 'Cannot save priorities for future dates' },
    //     { status: 400 }
    //   );
    // }

    const dateStr = parsedDate.toISOString().split('T')[0];

    // Convert priorities to DB format and update
    await Priority.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        date: dateStr
      },
      { priorities: toPriorityFormat(priorities) },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: 'Priorities updated' });
  } catch (error) {
    console.error('POST /api/priorities error:', error);
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

    // Delete priorities
    await Priority.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      date: dateStr
    });

    return NextResponse.json({ message: 'Priorities deleted' });
  } catch (error) {
    console.error('DELETE /api/priorities error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}