import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(`${process.env.PLATFORM_URL}/login?error=no_code`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://passport.feishu.cn/suite/passport/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.FEISHU_APP_ID,
        client_secret: process.env.FEISHU_APP_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Feishu token error:', tokenData);
      return NextResponse.redirect(`${process.env.PLATFORM_URL}/login?error=token_failed`);
    }

    // Get user info
    const userResponse = await fetch('https://open.feishu.cn/open-apis/authen/v1/user_info', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userData.data?.open_id) {
      console.error('Feishu user info error:', userData);
      return NextResponse.redirect(`${process.env.PLATFORM_URL}/login?error=user_info_failed`);
    }

    const user = userData.data;

    // Save/update user in database
    const db = getDb();
    const existingUser = db.prepare('SELECT * FROM users WHERE feishu_open_id = ?').get(user.open_id);

    if (existingUser) {
      db.prepare('UPDATE users SET name = ?, avatar_url = ?, last_login = datetime(\'now\') WHERE feishu_open_id = ?').run(
        user.name,
        user.avatar_url,
        user.open_id
      );
    } else {
      db.prepare(`
        INSERT INTO users (id, feishu_open_id, name, avatar_url, role)
        VALUES (?, ?, ?, ?, 'user')
      `).run(uuidv4(), user.open_id, user.name, user.avatar_url);
    }

    // Set session cookie (simplified - in production use proper session management)
    const response = NextResponse.redirect(`${process.env.PLATFORM_URL}/`);
    response.cookies.set('feishu_session', JSON.stringify({
      open_id: user.open_id,
      name: user.name,
      avatar_url: user.avatar_url,
      token: tokenData.access_token,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Feishu callback error:', error);
    return NextResponse.redirect(`${process.env.PLATFORM_URL}/login?error=server_error`);
  }
}