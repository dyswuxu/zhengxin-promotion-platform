import { NextResponse } from 'next/server';
import { getProductById, updateProduct } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = getProductById(params.id) as Record<string, unknown> | undefined;
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Normalize product data to match frontend types
    const parsedProduct = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      cost: product.cost,
      grossMargin: product.gross_margin,
      targetUser: product.target_user,
      sellingPoints: product.selling_points ? JSON.parse(product.selling_points as string) : [],
      launchDate: product.launch_date,
      region: product.region,
      status: product.status,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };

    return NextResponse.json({ product: parsedProduct });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.name) updates.name = body.name;
    if (body.category) updates.category = body.category;
    if (body.price) updates.price = parseFloat(body.price);
    if (body.cost) updates.cost = parseFloat(body.cost);
    if (body.targetUser) updates.target_user = body.targetUser;
    if (body.sellingPoints) updates.selling_points = JSON.stringify(body.sellingPoints);
    if (body.launchDate) updates.launch_date = body.launchDate;
    if (body.region) updates.region = body.region;
    if (body.status) updates.status = body.status;

    // Recalculate gross margin if price or cost changed
    if (body.price || body.cost) {
      const current = getProductById(params.id) as { price: number; cost: number };
      const price = body.price ? parseFloat(body.price) : current.price;
      const cost = body.cost ? parseFloat(body.cost) : current.cost;
      updates.gross_margin = ((price - cost) / price) * 100;
    }

    updateProduct(params.id, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}