import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Item from '../../lib/models/Item';
import { 
  ItemDocument, 
  PostRequestBody,
  verifyAuth,
  getDateRange,
  formatDateForApi
} from '../../lib/utils/itemsUtils';
import { Types } from 'mongoose';

// Type-specific handlers
const handleHabitQuery = async (userId: Types.ObjectId, date: string) => {
  const currentDate = new Date(date);
  const dateString = currentDate.toISOString().split('T')[0];

  const habits = await Item.find({
    userId,
    type: 'habit',
    $or: [
      { regularity: 'daily' },
      { regularity: 'weekly', createdAt: { $lte: currentDate } },
      { regularity: 'monthly', createdAt: { $lte: currentDate } },
      { regularity: 'yearly', createdAt: { $lte: currentDate } }
    ]
  }).lean() as ItemDocument[];

  const completions = await Item.find({
    userId,
    type: 'habit',
    date: dateString,
    completed: true
  }).lean() as ItemDocument[];

  return habits.map(habit => ({
    ...habit,
    completed: completions.some(completion => 
      completion._id.toString() === habit._id.toString()
    ),
    date: dateString
  }));
};

const handleRegularQuery = async (userId: Types.ObjectId, type: string, date: string) => {
  const { startDate, endDate } = getDateRange(date);
  return await Item.find({
    userId,
    type,
    createdAt: { $gte: startDate, $lte: endDate }
  }).sort({ order: 1, createdAt: 1 }).lean();
};

export async function GET(request: Request) {
  try {
    await connectDB();
    const userId = await verifyAuth(request);

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const type = searchParams.get('type');

    if (!date || !type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Date and type are required' 
      }, { status: 400 });
    }

    const items = type === 'habit' 
      ? await handleHabitQuery(userId, date)
      : await handleRegularQuery(userId, type, date);

    return NextResponse.json({
      success: true,
      data: { items }
    });
  } catch (error) {
    console.error('GET /api/items error:', error);
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}

// POST handlers
async function handleHabitPost(
  userId: Types.ObjectId, 
  date: string, 
  body: PostRequestBody
) {
  const dateString = new Date(date).toISOString().split('T')[0];
  const { text, regularity, completed } = body;

  const existingHabit = await Item.findOne({
    userId,
    type: 'habit',
    text,
    regularity
  }).lean() as ItemDocument | null;

  if (completed !== undefined && existingHabit) {
    if (completed) {
      return await Item.findOneAndUpdate(
        { userId, type: 'habit', _id: existingHabit._id },
        { $set: { completed: true, date: dateString } },
        { upsert: true, new: true }
      ).lean();
    } else {
      await Item.deleteOne({
        userId,
        type: 'habit',
        _id: existingHabit._id,
        date: dateString
      });
      return existingHabit;
    }
  }

  const habitData = {
    userId,
    type: 'habit',
    text,
    regularity,
    order: body.order || 0
  };

  if (existingHabit) {
    return await Item.findByIdAndUpdate(
      existingHabit._id, 
      habitData,
      { new: true }
    ).lean();
  }

  return await Item.create(habitData);
}

async function handleRegularPost(
  userId: Types.ObjectId, 
  type: string, 
  date: string, 
  body: PostRequestBody
) {
  const createdAt = new Date(date);
  createdAt.setHours(12, 0, 0, 0);

  return await Item.create({
    userId,
    type,
    text: body.text,
    order: body.order || 0,
    createdAt
  });
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const userId = await verifyAuth(request);

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const type = searchParams.get('type');
    
    if (!date || !type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Date and type are required' 
      }, { status: 400 });
    }

    const body = await request.json() as PostRequestBody;
    
    const item = type === 'habit' 
      ? await handleHabitPost(userId, date, body)
      : await handleRegularPost(userId, type, date, body);

    return NextResponse.json({
      success: true,
      data: { item }
    });
  } catch (error) {
    console.error('POST /api/items error:', error);
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}