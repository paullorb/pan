// /app/api/tasks/route.ts

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Task from '../../lib/models/Task';
import jwt from 'jsonwebtoken';

function formatDateString(year: number, month: number, day: number): string {
  const y = year.toString();
  const m = (month + 1).toString().padStart(2, '0'); // month is zero-based
  const d = day.toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId: any;
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let tasks: any[];

    if (date) {
      // Fetch tasks for the specific date
      tasks = await Task.find({ userId, date }).sort({ createdAt: 1 });
    } else if (month && year) {
      // Fetch tasks for the entire month
      const yearNum = parseInt(year);
      const monthNum = parseInt(month) - 1; // month is zero-based

      const daysInMonth = new Date(yearNum, monthNum + 1, 0).getDate();

      const startDateString = formatDateString(yearNum, monthNum, 1);
      const endDateString = formatDateString(yearNum, monthNum, daysInMonth);

      tasks = await Task.find({
        userId,
        date: {
          $gte: startDateString,
          $lte: endDateString,
        },
      }).sort({ date: 1, createdAt: 1 });
    } else {
      return NextResponse.json(
        { error: 'Date or month and year parameters are required' },
        { status: 400 }
      );
    }

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
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

    let userId: any;
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { action, task } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action parameter is required' }, { status: 400 });
    }

    if (action === 'add') {
      const { text, date } = task;
      if (!text || !date) {
        return NextResponse.json({ error: 'Text and date are required' }, { status: 400 });
      }

      const newTask = new Task({
        userId,
        date,
        text,
        completed: false,
      });

      await newTask.save();

      return NextResponse.json({ message: 'Task added', task: newTask }, { status: 200 });
    } else if (action === 'update') {
      const { id, completed } = task;
      if (!id || typeof completed !== 'boolean') {
        return NextResponse.json(
          { error: 'Task ID and completed status are required' },
          { status: 400 }
        );
      }

      const updatedTask = await Task.findOneAndUpdate(
        { _id: id, userId },
        { completed },
        { new: true }
      );

      if (!updatedTask) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Task updated', task: updatedTask }, { status: 200 });
    } else if (action === 'delete') {
      const { id } = task;
      if (!id) {
        return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
      }

      const deletedTask = await Task.findOneAndDelete({ _id: id, userId });

      if (!deletedTask) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Task deleted' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
