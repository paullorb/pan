import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import Item from '../../lib/models/Item';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export async function GET(request: Request) {
  try {
    await connectDB();

    // Auth check
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = new Types.ObjectId(decoded.userId);

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const type = searchParams.get('type');

    if (!date || !type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Date and type are required' 
      }, { status: 400 });
    }

    // Get items for the day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const items = await Item.find({
      userId,
      type,
      createdAt: { $gte: startDate, $lte: endDate }
    })
    .sort({ order: 1 }) // Sort by order first
    .lean();

    return NextResponse.json({
      success: true,
      data: { items }
    });
  } catch (error) {
    console.error('GET /api/items error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = new Types.ObjectId(decoded.userId);

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const type = searchParams.get('type');
    
    if (!date || !type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Date and type are required' 
      }, { status: 400 });
    }

    const { text, order } = await request.json() as { 
      text: string;
      order: number;
    };

    // For priorities, validate order is 0-2
    if (type === 'priority' && (order < 0 || order > 2)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Priority order must be 0, 1, or 2' 
      }, { status: 400 });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Find existing priority for this slot
    const existingItem = await Item.findOne({
      userId,
      type,
      order,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    let item;
    if (existingItem) {
      // Update existing item
      item = await Item.findByIdAndUpdate(
        existingItem._id,
        { text },
        { new: true }
      );
    } else {
      // Create new item with the date
      item = await Item.create({
        userId,
        type,
        text,
        order,
        createdAt: new Date(date)
      });
    }

    return NextResponse.json({
      success: true,
      data: { item }
    });
  } catch (error) {
    console.error('POST /api/items error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();

    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = new Types.ObjectId(decoded.userId);

    const { id } = await request.json() as { id: string };

    const result = await Item.deleteOne({
      _id: new Types.ObjectId(id),
      userId
    });

    return NextResponse.json({
      success: true,
      data: { deleted: result.deletedCount > 0 }
    });

  } catch (error) {
    console.error('DELETE /api/items error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}