import { NextResponse, NextRequest } from 'next/server'
import connectDB from '../../lib/mongodb'
import Exercise from '../../lib/models/Exercise'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const userId = decoded.userId;
  const { searchParams } = new URL(request.url);
  const exerciseId = searchParams.get('exerciseId');
  const fetchLast = searchParams.get('last') === 'true';

  if (!exerciseId) {
    return NextResponse.json({ error: 'Missing exerciseId' }, { status: 400 });
  }

  await connectDB();

  if (fetchLast) {
    const dayStartToday = new Date();
    dayStartToday.setHours(0, 0, 0, 0);

    const lastExercise = await Exercise.findOne({
      userId,
      exerciseId,
      date: { $lt: dayStartToday }
    })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({ exercise: lastExercise || null }, { status: 200 });
  } else {
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const existing = await Exercise.findOne({
      userId,
      exerciseId,
      date: { $gte: dayStart, $lt: dayEnd }
    }).lean();

    return NextResponse.json({ exercise: existing || null }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = authHeader.split(' ')[1]
  let decoded: any
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string)
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  const userId = decoded.userId
  const { exerciseId, type, sets, date } = await request.json()

  if (!exerciseId || !type || !sets) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  await connectDB()
  const exerciseDate = date ? new Date(date) : new Date()
  const dayStart = new Date(exerciseDate.getFullYear(), exerciseDate.getMonth(), exerciseDate.getDate())
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)

  const existing = await Exercise.findOne({ userId, exerciseId, date: { $gte: dayStart, $lt: dayEnd } })

  if (existing) {
    existing.type = type
    existing.sets = sets
    existing.date = exerciseDate
    await existing.save()
    return NextResponse.json({ message: 'Exercise updated' }, { status: 200 })
  } else {
    await Exercise.create({ userId, exerciseId, type, sets, date: exerciseDate })
    return NextResponse.json({ message: 'Exercise created' }, { status: 201 })
  }
}

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = authHeader.split(' ')[1]
  let decoded: any
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string)
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  const userId = decoded.userId
  const { searchParams } = new URL(request.url)
  const exerciseId = searchParams.get('exerciseId')
  if (!exerciseId) {
    return NextResponse.json({ error: 'Missing exerciseId' }, { status: 400 })
  }
  
  await connectDB()
  const now = new Date()
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)
  
  await Exercise.findOneAndDelete({
    userId,
    exerciseId,
    date: { $gte: dayStart, $lt: dayEnd }
  })
  
  return NextResponse.json({ message: 'Exercise marked as incomplete' }, { status: 200 })
}
