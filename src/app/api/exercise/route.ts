import { NextResponse, NextRequest } from 'next/server'
import connectDB from '../../lib/mongodb'
import Exercise from '../../lib/models/Exercise'
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
  const newExercise = new Exercise({
    userId,
    exerciseId,
    type,
    date: date ? new Date(date) : new Date(),
    details
  })
  await newExercise.save()
  return NextResponse.json({ message: 'Exercise saved successfully' }, { status: 201 })
}
