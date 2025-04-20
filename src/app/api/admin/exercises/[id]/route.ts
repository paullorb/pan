import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import ExerciseDef from '../../../../lib/models/ExerciseDef';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const updates = await req.json();
  await connectDB();
  const def = await ExerciseDef
    .findByIdAndUpdate(params.id, updates, { new: true })
    .lean();
  return NextResponse.json(def);
}

export async function DELETE(
  { params }: { params: { id: string } }
) {
  await connectDB();
  await ExerciseDef.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
