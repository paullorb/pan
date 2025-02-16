import { NextResponse } from "next/server";
import connectDB from "app/lib/mongodb";
import Entry from "app/lib/models/Entry";

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const existingEntry = await Entry.findOne({ date: data.date, text: data.text });
    if (existingEntry) {
      return NextResponse.json({ success: false, message: "entry already exists" });
    }
    
    const newEntry = new Entry(data);
    await newEntry.save();
    return NextResponse.json({ success: true, data: newEntry });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
