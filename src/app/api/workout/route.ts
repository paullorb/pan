import { NextResponse, NextRequest } from 'next/server'
import connectDB from '../../lib/mongodb'
import Workout from '../../lib/models/Workout'
import jwt from 'jsonwebtoken'

async function authenticate(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 }
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string)
    return { userId: decoded.userId }
  } catch (err) {
    return { error: 'Invalid token', status: 401 }
  }
}

export async function GET(request: NextRequest) {
  // Authenticate user
  const auth = await authenticate(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const userId = auth.userId

  const { searchParams } = new URL(request.url)
  const dateParam = searchParams.get('date')
  if (!dateParam) {
    return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 })
  }
  
  const requestedDate = new Date(dateParam)
  const dayStart = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate())
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)

  await connectDB()
  try {
    const workoutDoc = await Workout.findOne({
      userId,
      date: { $gte: dayStart, $lt: dayEnd }
    }).lean() as { workout: { cardio: string[]; weight: string[]; stretch: string[] } } | null

    return NextResponse.json({ workout: workoutDoc?.workout || {} }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Authenticate user
  const auth = await authenticate(request)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }
  const userId = auth.userId

  let body: { date: string; workout: { cardio: string[]; weight: string[]; stretch: string[] } }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const { date, workout } = body
  if (!date || !workout) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const exerciseDate = new Date(date)
  const dayStart = new Date(exerciseDate.getFullYear(), exerciseDate.getMonth(), exerciseDate.getDate())
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)

  await connectDB()
  try {
    const existing = await Workout.findOne({
      userId,
      date: { $gte: dayStart, $lt: dayEnd }
    })
    if (existing) {
      existing.workout = workout
      existing.date = exerciseDate
      await existing.save()
      return NextResponse.json({ message: 'Workout updated' }, { status: 200 })
    } else {
      const newWorkout = new Workout({
        userId,
        date: exerciseDate,
        workout
      })
      await newWorkout.save()
      return NextResponse.json({ message: 'Workout created' }, { status: 201 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
