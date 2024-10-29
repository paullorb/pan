import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import { ItemType, ITEM_TYPES } from '../../lib/models/types';
import Item from '../../lib/models/Item';
import { 
  verifyAuth,
  queryItems,
  saveItem,
  PostRequestBody,
} from '../../lib/utils/itemsUtils';

export async function GET(request: Request) {
  try {
    await connectDB();
    const userId = await verifyAuth(request);

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const typeParam = searchParams.get('type');

    if (!date || !typeParam) {
      return NextResponse.json({ 
        success: false, 
        error: 'Date and type are required' 
      }, { status: 400 });
    }

    // Validate type parameter
    if (!ITEM_TYPES.includes(typeParam as any)) {
      return NextResponse.json({ 
        success: false, 
        error: `Invalid item type. Must be one of: ${ITEM_TYPES.join(', ')}` 
      }, { status: 400 });
    }

    const type = typeParam as ItemType;
    const items = await queryItems(userId, type, date);

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
    const typeParam = searchParams.get('type');
    
    if (!date || !typeParam) {
      return NextResponse.json({ 
        success: false, 
        error: 'Date and type are required' 
      }, { status: 400 });
    }

    // Validate type parameter
    if (!ITEM_TYPES.includes(typeParam as any)) {
      return NextResponse.json({ 
        success: false, 
        error: `Invalid item type. Must be one of: ${ITEM_TYPES.join(', ')}` 
      }, { status: 400 });
    }

    const type = typeParam as ItemType;
    const body = await request.json() as PostRequestBody;
    const item = await saveItem(userId, type, date, body);

    return NextResponse.json({
      success: true,
      data: { item }
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