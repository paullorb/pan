import { NextResponse, NextRequest } from 'next/server'
import connectDB from '../../lib/mongodb'
import Exercise from '../../lib/models/exercise'
import jwt from 'jsonwebtoken'

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
  const { exerciseId, type, details, date } = await request.json()
  if (!exerciseId || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  await connectDB()
  const exerciseDate = date ? new Date(date) : new Date()
  const dayStart = new Date(exerciseDate.getFullYear(), exerciseDate.getMonth(), exerciseDate.getDate())
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)

  let existing = await Exercise.findOne({
    userId,
    exerciseId,
    date: { $gte: dayStart, $lt: dayEnd }
  })

  if (existing) {
    existing.type = type
    existing.details = details
    existing.date = exerciseDate
    await existing.save()
    return NextResponse.json({ message: 'Exercise updated' }, { status: 200 })
  } else {
    const newExercise = new Exercise({
      userId,
      exerciseId,
      type,
      date: exerciseDate,
      details
    })
    await newExercise.save()
    return NextResponse.json({ message: 'Exercise created' }, { status: 201 })
  }
}
