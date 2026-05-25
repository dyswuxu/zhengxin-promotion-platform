import { NextResponse } from 'next/server';
import { getPromotionPlanByProductId } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const plan = getPromotionPlanByProductId(params.id) as Record<string, unknown> | undefined;

    if (!plan) {
      return NextResponse.json({ plan: null });
    }

    // Parse JSON fields with type assertions
    const parsedPlan = {
      ...plan,
      sellingPoints: plan.selling_points ? JSON.parse(plan.selling_points as string) : [],
      promotionPhases: plan.promotion_phases ? JSON.parse(plan.promotion_phases as string) : [],
      storeSop: plan.store_sop ? JSON.parse(plan.store_sop as string) : [],
      marketingAssets: plan.marketing_assets ? JSON.parse(plan.marketing_assets as string) : [],
      score: plan.score ? JSON.parse(plan.score as string) : { popularity: 0, repurchase: 0, riskAlert: '' },
    } as Record<string, unknown>;

    return NextResponse.json({ plan: parsedPlan });
  } catch (error) {
    console.error('Get plan error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan' },
      { status: 500 }
    );
  }
}