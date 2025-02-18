// route.ts

import { NextResponse, NextRequest } from 'next/server'
import connectDB from '../../lib/mongodb'
import Entry from '../../lib/models/Entry'
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
  const entries = await Entry.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  }).lean()
  return NextResponse.json(entries, { status: 200 })
}

export async function POST(request: Request) {
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
  const { date, text, context } = await request.json()
  if (!date || !text) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  await connectDB()
  const newEntry = new Entry({ date, text, context, userId })
  await newEntry.save()
  return NextResponse.json({ message: 'Entry saved successfully' }, { status: 201 })
}
