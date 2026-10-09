import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentName: user.departmentName,
        collegeId: user.collegeId,
        phone: user.phone,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to authenticate user' }, { status: 500 });
  }
}
