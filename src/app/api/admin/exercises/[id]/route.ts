import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import ExerciseDef from '../../../../lib/models/ExerciseDef'

export async function PATCH(
  req: Request,
  context: any     // ← use `any` here
) {
  const { id } = context.params as { id: string }
  const updates = await req.json()
  await connectDB()
  const def = await ExerciseDef.findByIdAndUpdate(id, updates, { new: true }).lean()
  return NextResponse.json(def)
}

export async function DELETE(
  req: Request,
  context: any     // ← and here
) {
  const { id } = context.params as { id: string }
  await connectDB()
  await ExerciseDef.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
