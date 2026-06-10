import { NextRequest, NextResponse } from 'next/server';
import { getTrialPlanById, updateTrialPlan, updateTrialConclusion } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trial = getTrialPlanById(id) as any;
    
    if (!trial) {
      return NextResponse.json({ error: 'Trial plan not found' }, { status: 404 });
    }
    
    // Normalize trial data to match frontend types
    const normalizedTrial = {
      id: trial.id,
      productId: trial.product_id,
      productName: trial.product_name,
      category: trial.category,
      price: trial.price,
      cost: trial.cost,
      startDate: trial.start_date,
      endDate: trial.end_date,
      status: trial.status,
      storeIds: JSON.parse(trial.store_ids || '[]'),
      storeTypes: JSON.parse(trial.store_types || '[]'),
      conclusion: trial.conclusion ? JSON.parse(trial.conclusion) : null,
      createdAt: trial.created_at,
      updatedAt: trial.updated_at,
    };
    
    return NextResponse.json(normalizedTrial);
  } catch (error) {
    console.error('Error fetching trial plan:', error);
    return NextResponse.json({ error: 'Failed to fetch trial plan' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, conclusion } = body;
    
    if (conclusion) {
      updateTrialConclusion(id, conclusion);
    } else if (status) {
      updateTrialPlan(id, { status });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating trial plan:', error);
    return NextResponse.json({ error: 'Failed to update trial plan' }, { status: 500 });
  }
}