import { NextResponse, NextRequest } from 'next/server'
import connectDB from 'app/lib/mongodb'
import Entry from 'app/lib/models/Entry'
import jwt from 'jsonwebtoken'

async function authorize(req: NextRequest) {
  const h = req.headers.get('authorization') || ''
  if (!h.startsWith('Bearer ')) throw new Error('Unauthorized')
  const token = h.slice(7)
  return (jwt.verify(token, process.env.JWT_SECRET!) as any).userId
}

export async function GET(req: NextRequest) {
  const userId = await authorize(req)
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('startDate')
  const end = searchParams.get('endDate')
  if (!start || !end) return NextResponse.json({ error: 'Missing dates' }, { status: 400 })
  await connectDB()
  const entries = await Entry.find({
    userId,
    date: { $gte: start, $lte: end }
  }).lean()
  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  const userId = await authorize(req)
  const { date, text, parentId, done } = await req.json()
  if (!date || !text) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  await connectDB()
  const e = new Entry({ date, text, parentId: parentId || null, userId, done: done || false })
  await e.save()
  return NextResponse.json(e, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const userId = await authorize(req)
  const { id, done, category, parentId } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const upd: any = {}
  if (typeof done === 'boolean') upd.done = done
  if (category !== undefined) upd.category = category
  if (parentId !== undefined) upd.parentId = parentId
  await connectDB()
  const entry = await Entry.findOneAndUpdate({ _id: id, userId }, upd, { new: true })
  if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(entry)
}
