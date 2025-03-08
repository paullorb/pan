import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import User from "../../lib/models/User";
import jwt from "jsonwebtoken";

async function authenticate(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    await connectDB();
    const user = await User.findById(payload.userId);
    return user;
  } catch (error) {
    return null;
  }
}

export async function GET(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
