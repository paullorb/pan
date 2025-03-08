import { NextResponse, NextRequest } from "next/server";
import connectDB from "../../lib/mongodb";
import Workout from "../../lib/models/Workout";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const userId = decoded.userId;

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const exercise = searchParams.get("exercise");
  if (!date || !exercise) {
    return NextResponse.json(
      { error: "Missing query parameters: date and exercise required" },
      { status: 400 }
    );
  }

  await connectDB();
  const workout = await Workout.findOne({ userId, date, exercise }).lean();
  return NextResponse.json(workout || {}, { status: 200 });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const userId = decoded.userId;

  const { date, exercise, sets, done } = await request.json();
  if (!date || !exercise || !sets) {
    return NextResponse.json(
      { error: "Missing required fields: date, exercise and sets" },
      { status: 400 }
    );
  }

  await connectDB();
  try {
    let workout = await Workout.findOne({ userId, date, exercise });
    if (workout) {
      workout.sets = sets;
      workout.done = done ?? false;
      await workout.save();
    } else {
      workout = new Workout({ date, exercise, sets, done: done ?? false, userId });
      await workout.save();
    }
    return NextResponse.json({ message: "Workout saved successfully" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error saving workout" }, { status: 500 });
  }
}
