// Feishu notification module
// Send messages to users via Feishu bot

const APP_ID = process.env.FEISHU_APP_ID || 'cli_a933baa1df639bde';
const APP_SECRET = process.env.FEISHU_APP_SECRET || 'OwfCbDP1IlVXhLFI8f21HPpRHq1N0aQH';

interface FeishuMessage {
  receive_id: string;
  msg_type: 'text' | 'post' | 'file' | 'interactive';
  content: string;
}

interface FeishuResponse {
  code: number;
  msg: string;
  data?: any;
}

// HTTP request helper
async function httpRequest(url: string, options: RequestInit, postData?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = require('https').request(reqOptions, (res: any) => {
      let data = '';
      res.on('data', (chunk: any) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

// Get app access token
export async function getAppAccessToken(): Promise<string> {
  const url = 'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal';
  const data = JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET });

  const result = await httpRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, data);

  if (result.code !== 0) {
    throw new Error(`Failed to get token: ${result.msg}`);
  }

  return result.app_access_token;
}

// Send text message
export async function sendTextMessage(receiveId: string, text: string): Promise<boolean> {
  const token = await getAppAccessToken();

  const message: FeishuMessage = {
    receive_id: receiveId,
    msg_type: 'text',
    content: JSON.stringify({ text }),
  };

  const url = `https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id`;
  const data = JSON.stringify(message);

  const result = await httpRequest(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }, data);

  if (result.code !== 0) {
    console.error('Failed to send message:', result.msg);
    return false;
  }

  return true;
}

// Send rich text message (post)
export async function sendPostMessage(
  receiveId: string,
  title: string,
  content: Array<Array<{ tag: string; text: string }>>
): Promise<boolean> {
  const token = await getAppAccessToken();

  const postContent = {
    zh_cn: {
      title,
      content: content.map(row => row.map(item => ({
        tag: item.tag,
        text: item.text,
      }))),
    },
  };

  const message = {
    receive_id: receiveId,
    msg_type: 'post',
    content: JSON.stringify(postContent),
  };

  const url = `https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id`;
  const data = JSON.stringify(message);

  const result = await httpRequest(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }, data);

  if (result.code !== 0) {
    console.error('Failed to send post message:', result.msg);
    return false;
  }

  return true;
}

// Send interactive card message
export async function sendCardMessage(
  receiveId: string,
  title: string,
  description: string,
  actionUrl?: string,
  actionText?: string
): Promise<boolean> {
  const token = await getAppAccessToken();

  const elements = [
    {
      tag: 'div',
      text: {
        tag: 'lark_md',
        content: description,
      },
    },
  ];

  if (actionUrl) {
    elements.push({
      tag: 'action',
      actions: [
        {
          tag: 'button',
          text: {
            tag: 'lark_md',
            content: actionText || '查看详情',
          },
          type: 'primary',
          url: actionUrl,
        },
      ],
    } as any);
  }

  const card = {
    config: {
      wide_screen_mode: true,
    },
    header: {
      title: {
        tag: 'plain_text',
        content: title,
      },
      template: 'blue',
    },
    elements,
  };

  const message = {
    receive_id: receiveId,
    msg_type: 'interactive',
    content: JSON.stringify(card),
  };

  const url = `https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id`;
  const data = JSON.stringify(message);

  const result = await httpRequest(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }, data);

  if (result.code !== 0) {
    console.error('Failed to send card message:', result.msg);
    return false;
  }

  return true;
}

// Send task notification
export async function sendTaskNotification(
  receiveId: string,
  taskName: string,
  deadline: string,
  status: string,
  productName?: string
): Promise<boolean> {
  const statusText: Record<string, string> = {
    pending: '待执行',
    in_progress: '进行中',
    completed: '已完成',
    delayed: '已延迟',
    abnormal: '异常',
  };

  const statusColor = status === 'completed' ? 'green' : status === 'delayed' ? 'red' : 'blue';

  const description = `
**任务状态更新**

任务名称：${taskName}
${productName ? `所属新品：${productName}` : ''}
状态：${statusText[status] || status}
截止时间：${deadline}
  `.trim();

  const platformUrl = process.env.PLATFORM_URL || 'http://localhost:3002';

  return sendCardMessage(
    receiveId,
    `📋 ${statusText[status] || status} - ${taskName}`,
    description,
    `${platformUrl}/tasks`,
    '查看任务'
  );
}

// Send alert notification
export async function sendAlertNotification(
  receiveId: string,
  alertType: string,
  productName: string,
  message: string
): Promise<boolean> {
  const emoji = alertType === 'warning' ? '⚠️' : alertType === 'error' ? '🚨' : 'ℹ️';

  return sendCardMessage(
    receiveId,
    `${emoji} ${alertType === 'warning' ? '预警提醒' : alertType === 'error' ? '异常告警' : '通知'}`,
    `**${productName}**

${message}`,
    `${process.env.PLATFORM_URL || 'http://localhost:3002'}/products`,
    '查看新品'
  );
}

// Batch send messages
export async function batchSendMessage(
  receiveIds: string[],
  messageGenerator: (id: string) => Promise<boolean>
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const id of receiveIds) {
    try {
      const result = await messageGenerator(id);
      if (result) {
        success++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`Failed to send to ${id}:`, error);
      failed++;
    }

    // Rate limit: wait 100ms between messages
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return { success, failed };
}