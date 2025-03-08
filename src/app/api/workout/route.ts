import { NextResponse, NextRequest } from 'next/server'
import connectDB from '../../lib/mongodb'
import Workout from '../../lib/models/Workout'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = authHeader.split(' ')[1]
  let decoded: any
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  const userId = decoded.userId
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 })
  }
  await connectDB()
  const logs = await Workout.find({
    userId,
    date: { $gte: new Date(startDate), $lte: new Date(endDate) }
  }).lean()
  return NextResponse.json(logs, { status: 200 })
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = authHeader.split(' ')[1]
  let decoded: any
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  const userId = decoded.userId
  const { exerciseId, type, details, date } = await request.json()
  if (!exerciseId || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  await connectDB()
  const newWorkout = new Workout({
    userId,
    exerciseId,
    type,
    date: date ? new Date(date) : new Date(),
    details
  })
  await newWorkout.save()
  return NextResponse.json({ message: 'Workout log saved successfully' }, { status: 201 })
}
