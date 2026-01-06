// src/app/api/ex/route.ts
import { NextResponse, NextRequest } from "next/server";
import connectDB from "../../lib/mongodb";
import Exercise from "../../lib/models/Exercise";
import jwt from "jsonwebtoken";

async function authorize(req: NextRequest) {
  const h = req.headers.get("authorization") || "";
  if (!h.startsWith("Bearer ")) throw new Error("Unauthorized");
  return (jwt.verify(h.slice(7), process.env.JWT_SECRET!) as any).userId;
}

export async function GET(req: NextRequest) {
  const userId = await authorize(req);
  const { searchParams } = new URL(req.url);

  // today’s exercises
  if (searchParams.get("today") === "true") {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    await connectDB();
    const list = await Exercise.find({ userId, date: { $gte: start, $lt: end } }).lean();
    return NextResponse.json({ exercises: list });
  }

  // month view
  const m = searchParams.get("month");
  const y = searchParams.get("year");
  if (m && y) {
    const month = parseInt(m, 10), year = parseInt(y, 10);
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);
    await connectDB();
    const list = await Exercise.find({ userId, date: { $gte: start, $lt: end } }).lean();
    return NextResponse.json({ exercises: list });
  }

  // single / last / create-or-read
  const exerciseId = searchParams.get("exerciseId");
  const last = searchParams.get("last") === "true";
  if (!exerciseId) {
    return NextResponse.json({ error: "Missing exerciseId" }, { status: 400 });
  }
  await connectDB();

  if (last) {
    const beforeToday = new Date();
    beforeToday.setHours(0, 0, 0, 0);
    const doc = await Exercise.findOne({
      userId,
      exerciseId,
      date: { $lt: beforeToday }
    })
      .sort({ date: -1 })
      .lean();
    return NextResponse.json({ exercise: doc || null });
  } else {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    const doc = await Exercise.findOne({
      userId,
      exerciseId,
      date: { $gte: todayStart, $lt: todayEnd }
    }).lean();
    return NextResponse.json({ exercise: doc || null });
  }
}

export async function POST(req: NextRequest) {
  const userId = await authorize(req);
  const { exerciseId, type, sets, date } = await req.json();
  if (!exerciseId || !type || !sets) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const d = date ? new Date(date) : new Date();
  const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  await connectDB();
  const existing = await Exercise.findOne({
    userId,
    exerciseId,
    date: { $gte: dayStart, $lt: dayEnd }
  });

  if (existing) {
    existing.type = type;
    existing.sets = sets;
    existing.date = d;
    await existing.save();
    return NextResponse.json({ message: "Exercise updated" });
  } else {
    await Exercise.create({ userId, exerciseId, type, sets, date: d });
    return NextResponse.json({ message: "Exercise created" }, { status: 201 });
  }
}

export async function DELETE(req: NextRequest) {
  const userId = await authorize(req);
  const { searchParams } = new URL(req.url);
  const exerciseId = searchParams.get("exerciseId");
  if (!exerciseId) {
    return NextResponse.json({ error: "Missing exerciseId" }, { status: 400 });
  }

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  await connectDB();
  await Exercise.findOneAndDelete({
    userId,
    exerciseId,
    date: { $gte: start, $lt: end }
  });
  return NextResponse.json({ message: "Exercise deleted" });
}
