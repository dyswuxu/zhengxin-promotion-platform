import { NextResponse } from 'next/server';
import { updateTaskStatus, getTaskById } from '@/lib/db';
import { sendTaskNotification } from '@/lib/feishu-notify';

interface TaskWithDetails {
  id: string;
  product_id: string;
  store_id: string;
  description?: string;
  deadline?: string;
  product_name?: string;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const completedAt = status === 'completed'
      ? new Date().toISOString()
      : undefined;

    updateTaskStatus(params.id, status, completedAt);

    // Send Feishu notification when task status changes
    try {
      const task = getTaskById(params.id) as TaskWithDetails | undefined;
      if (task && task.store_id) {
        // For MVP, use a placeholder - in production would fetch from stores table
        const storeManagerOpenId = 'ou_36820cf198cd7945ca13ef4131ccae67'; // Boss's open ID

        await sendTaskNotification(
          storeManagerOpenId,
          task.description || '推广任务',
          task.deadline ? new Date(task.deadline).toLocaleDateString('zh-CN') : '待定',
          status,
          task.product_name
        );
      }
    } catch (notifyError) {
      // Don't fail the request if notification fails
      console.error('Failed to send task notification:', notifyError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}