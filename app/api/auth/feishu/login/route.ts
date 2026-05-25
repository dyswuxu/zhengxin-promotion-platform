import { NextResponse } from 'next/server';

export async function GET() {
  const appId = process.env.FEISHU_APP_ID;
  const redirectUri = encodeURIComponent(`${process.env.PLATFORM_URL}/api/auth/feishu/callback`);

  const feishuAuthUrl = `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&response_type=code&state=zhengxin_platform`;

  return NextResponse.redirect(feishuAuthUrl);
}