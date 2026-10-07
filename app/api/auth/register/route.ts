import { NextResponse } from 'next/server';
import { getUser, saveUser } from '../../../../lib/db';
import { UserProfile } from '../../../../lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, name, password, avatarType, avatarBgColor, isUpdateOnly } = body;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const cleanUsername = username.toLowerCase().trim();
    const existing = await getUser(cleanUsername);

    if (isUpdateOnly) {
      if (!existing) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      const updatedUser: UserProfile = {
        ...existing.user,
        avatarType: avatarType || existing.user.avatarType,
        avatarBgColor: avatarBgColor || existing.user.avatarBgColor,
      };
      await saveUser(updatedUser, existing.passwordHash);
      return NextResponse.json({ user: updatedUser });
    }

    if (existing) {
      return NextResponse.json({ error: 'Username already taken, please choose another or sign in' }, { status: 400 });
    }

    if (!password || password.length < 3) {
      return NextResponse.json({ error: 'Password must be at least 3 characters' }, { status: 400 });
    }

    const newUser: UserProfile = {
      username: cleanUsername,
      name: name.trim(),
      avatarType: avatarType || 'initials',
      avatarBgColor: avatarBgColor || '#CEFF00',
      createdAt: Date.now(),
    };

    // Store simple hash/password
    await saveUser(newUser, password);

    return NextResponse.json({ user: newUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
