import { NextResponse } from 'next/server';
import { getUser } from '../../../../lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const cleanUsername = username.toLowerCase().trim();
    const record = await getUser(cleanUsername);

    if (!record) {
      return NextResponse.json({ error: 'User does not exist. Please register first.' }, { status: 404 });
    }

    if (record.passwordHash !== password) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    return NextResponse.json({ user: record.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
