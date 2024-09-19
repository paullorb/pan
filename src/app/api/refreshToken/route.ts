// app/api/refreshToken/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '../../lib/models/User';
import connectDB from '../../lib/mongodb';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Get the refresh token from cookies
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not provided' },
        { status: 401 }
      );
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!refreshSecret) {
      console.error('JWT_REFRESH_SECRET is not defined');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, refreshSecret) as { userId: string };

    await connectDB();

    // Optionally, you can check if the user still exists or is valid
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Generate new Access Token
    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    );

    // Generate new Refresh Token (Token Rotation)
    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' }
    );

    // Set the new Refresh Token as HTTP-only cookie
    const response = NextResponse.json(
      { accessToken: newAccessToken },
      { status: 200 }
    );

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Adjust as needed
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
