import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import { ItemType, ITEM_TYPES } from '../../lib/models/types';
import Item from '../../lib/models/Item';
import { 
  verifyAuth,
  PostRequestBody,
} from '../../lib/utils/itemsUtils';

export async function GET(request: Request) {
  try {
    await connectDB();
    const userId = await verifyAuth(request);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!type || !startDate || !endDate) {
      return NextResponse.json({ 
        success: false, 
        error: 'Type and date range are required' 
      }, { status: 400 });
    }

    if (!ITEM_TYPES.includes(type as ItemType)) {
      return NextResponse.json({ 
        success: false, 
        error: `Invalid item type. Must be one of: ${ITEM_TYPES.join(', ')}` 
      }, { status: 400 });
    }

    const items = await Item.find({
      userId,
      type,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1, order: 1 }).lean();

    return NextResponse.json({
      success: true,
      data: { items }
    });
  } catch (error) {
    console.error('GET /api/items error:', error);
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const userId = await verifyAuth(request);

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    
    if (!date || !type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Date and type are required' 
      }, { status: 400 });
    }

    const body = await request.json() as PostRequestBody;

    // If we have an ID, this is an update operation
    if (id) {
      const existingItem = await Item.findOne({ _id: id, userId });
      if (!existingItem) {
        return NextResponse.json({ 
          success: false, 
          error: 'Item not found' 
        }, { status: 404 });
      }

      const updatedItem = await Item.findByIdAndUpdate(
        id,
        { 
          $set: { 
            completed: body.completed,
            text: body.text || existingItem.text,
            order: body.order || existingItem.order
          } 
        },
        { new: true }
      ).lean();

      return NextResponse.json({
        success: true,
        data: { item: updatedItem }
      });
    }

    // Otherwise create a new item
    const newItem = await Item.create({
      userId,
      type,
      date,
      text: body.text,
      order: body.order || 0,
      completed: body.completed || false
    });

    return NextResponse.json({
      success: true,
      data: { item: newItem }
    });
  } catch (error) {
    console.error('POST /api/items error:', error);
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const userId = await verifyAuth(request);

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');
    
    if (!itemId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Item ID is required' 
      }, { status: 400 });
    }

    const deletedItem = await Item.findOneAndDelete({
      _id: itemId,
      userId
    });

    if (!deletedItem) {
      return NextResponse.json({ 
        success: false, 
        error: 'Item not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { item: deletedItem }
    });
  } catch (error) {
    console.error('DELETE /api/items error:', error);
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}