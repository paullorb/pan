import { NextResponse } from "next/server";

type Entry = {
  date: string;
  text: string;
  context?: string | null;
};

let entries: Entry[] = [];

export async function POST(request: Request) {
  const data: Entry = await request.json();
  entries.push(data);
  return NextResponse.json({ success: true, data });
}
