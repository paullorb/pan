// app/api/validateToken/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    jwt.verify(token, secret);
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
