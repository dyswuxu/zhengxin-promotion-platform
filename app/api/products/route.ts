import { NextResponse } from 'next/server';
import { getProducts, createProduct, deleteProduct } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const products = getProducts(status || undefined);

    // Normalize products data to match frontend types
    const normalizedProducts = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      cost: p.cost,
      grossMargin: p.gross_margin,
      targetUser: p.target_user,
      sellingPoints: p.selling_points ? JSON.parse(p.selling_points) : [],
      launchDate: p.launch_date,
      region: p.region,
      status: p.status,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    return NextResponse.json({ products: normalizedProducts });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation
    if (!body.name || !body.category || !body.price || !body.cost) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const price = parseFloat(body.price);
    const cost = parseFloat(body.cost);
    const grossMargin = ((price - cost) / price) * 100;

    createProduct({
      id,
      name: body.name,
      category: body.category,
      price,
      cost,
      grossMargin,
      targetUser: body.targetUser || '',
      sellingPoints: body.sellingPoints || [],
      launchDate: body.launchDate || new Date().toISOString().split('T')[0],
      region: body.region || '全国',
      status: body.status || 'draft',
    });

    return NextResponse.json({
      success: true,
      product: { id, name: body.name }
    });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      );
    }

    deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}