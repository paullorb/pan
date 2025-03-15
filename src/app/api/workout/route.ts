import { NextResponse } from "next/server"
import dbConnect from "../../lib/mongodb"
import Workout from "../../lib/models/workout"

export async function GET(request: Request) {
  await dbConnect()
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")
  if (!date) {
    return NextResponse.json({ error: "Missing date parameter" }, { status: 400 })
  }
  // Replace with proper user handling later
  const userId = "dummyUser"
  try {
    const workoutDoc = await Workout.findOne({ userId, date })
    return NextResponse.json({ workout: workoutDoc?.workout || {} })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
