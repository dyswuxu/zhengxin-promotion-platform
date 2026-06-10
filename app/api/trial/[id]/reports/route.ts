import { NextRequest, NextResponse } from 'next/server';
import { 
  createTrialDailyReport, 
  getTrialDailyReports, 
  getTrialAggregatedData,
  getTrialPlanById 
} from '@/lib/db';
import { generateId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    
    const reports = getTrialDailyReports(id);
    const aggregated = getTrialAggregatedData(id);
    
    const parsedReports = (reports as Record<string, string>[]).map((r) => ({
      ...r,
      customer_feedback: JSON.parse(r.customer_feedback || '{}'),
      operation_issues: JSON.parse(r.operation_issues || '[]'),
    }));
    
    return NextResponse.json({
      reports: parsedReports,
      aggregated: aggregated,
    });
  } catch (error) {
    console.error('Error fetching trial reports:', error);
    return NextResponse.json({ error: 'Failed to fetch trial reports' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const {
      storeId,
      storeName,
      day,
      reportDate,
      newProductSales,
      newProductRatio,
      comboRate,
      avgOrderValueChange,
      customerFeedback,
      operationIssues,
      staffFeedback,
    } = body;
    
    if (!storeId || day === undefined || !reportDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const reportId = generateId();
    createTrialDailyReport({
      id: reportId,
      trialId: id,
      storeId,
      storeName,
      day,
      reportDate,
      newProductSales,
      newProductRatio,
      comboRate,
      avgOrderValueChange,
      customerFeedback,
      operationIssues,
      staffFeedback,
    });
    
    return NextResponse.json({ success: true, id: reportId });
  } catch (error) {
    console.error('Error creating trial report:', error);
    return NextResponse.json({ error: 'Failed to create trial report' }, { status: 500 });
  }
}