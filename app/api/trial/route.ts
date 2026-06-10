import { NextRequest, NextResponse } from 'next/server';
import { createTrialPlan, getTrialPlans, getTrialPlanById, updateTrialPlan } from '@/lib/db';
import { generateId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const trials = getTrialPlans(status);
    
    // Normalize trial data to match frontend types
    const normalizedTrials = (trials as any[]).map((t) => ({
      id: t.id,
      productId: t.product_id,
      productName: t.product_name,
      startDate: t.start_date,
      endDate: t.end_date,
      status: t.status,
      storeIds: JSON.parse(t.store_ids || '[]'),
      storeTypes: JSON.parse(t.store_types || '[]'),
      conclusion: t.conclusion ? JSON.parse(t.conclusion) : null,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));
    
    return NextResponse.json(normalizedTrials);
  } catch (error) {
    console.error('Error fetching trial plans:', error);
    return NextResponse.json({ error: 'Failed to fetch trial plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, startDate, endDate, storeIds, storeTypes } = body;
    
    if (!productId || !startDate || !endDate || !storeIds || storeIds.length < 8) {
      return NextResponse.json({ error: 'Missing required fields or insufficient stores (min 8)' }, { status: 400 });
    }
    
    const id = generateId();
    createTrialPlan({ id, productId, startDate, endDate, storeIds, storeTypes });
    
    const trial = getTrialPlanById(id);
    return NextResponse.json(trial);
  } catch (error) {
    console.error('Error creating trial plan:', error);
    return NextResponse.json({ error: 'Failed to create trial plan' }, { status: 500 });
  }
}