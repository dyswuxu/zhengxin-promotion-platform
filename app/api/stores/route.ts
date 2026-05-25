import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const stores = db.prepare('SELECT * FROM stores ORDER BY region, name').all();
    return NextResponse.json({ stores });
  } catch (error) {
    console.error('Stores API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const stmt = db.prepare(`
      INSERT INTO stores (id, name, region, city, district, address, manager_name, manager_phone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      body.id,
      body.name,
      body.region,
      body.city || '',
      body.district || '',
      body.address || '',
      body.managerName || '',
      body.managerPhone || '',
      body.status || 'active'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create store error:', error);
    return NextResponse.json(
      { error: 'Failed to create store' },
      { status: 500 }
    );
  }
}