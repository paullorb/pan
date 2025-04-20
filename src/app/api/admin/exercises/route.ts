import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import ExerciseDef from '../../../lib/models/ExerciseDef';// new Mongoose model

export async function GET() {
  await connectDB();
  const defs = await ExerciseDef.find().lean();
  return NextResponse.json(defs);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  await connectDB();
  const def = await ExerciseDef.create(data);
  return NextResponse.json(def, { status: 201 });
}
