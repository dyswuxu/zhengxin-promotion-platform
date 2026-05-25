import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db';
import { exportProductsToExcel } from '@/lib/import-export';

export async function GET() {
  try {
    const products = getProducts() as any[];

    // Normalize products data
    const normalizedProducts = products.map(p => ({
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
    }));

    const buffer = exportProductsToExcel(normalizedProducts);
    const uint8Array = new Uint8Array(buffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': "attachment; filename*=UTF-8''products.xlsx",
      },
    });
  } catch (error) {
    console.error('Export products error:', error);
    return NextResponse.json(
      { error: '导出失败' },
      { status: 500 }
    );
  }
}