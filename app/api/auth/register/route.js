import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password, role, departmentName, collegeId, phone } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter and one special character' },
        { status: 400 }
      );
    }

    // Security rule: admin cannot be created via public registration
    if (role === 'admin') {
      return NextResponse.json(
        { error: 'Administrator accounts cannot be created via public registration.' },
        { status: 403 }
      );
    }

    const assignedRole = 'user';

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: assignedRole,
      departmentName: departmentName ? departmentName.trim() : '',
      collegeId: collegeId ? collegeId.trim() : '',
      phone: phone ? phone.trim() : '',
    });

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    const response = NextResponse.json({
      message: 'Account registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentName: user.departmentName,
        collegeId: user.collegeId,
      },
      token,
    });

    response.cookies.set('reuse_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete registration' },
      { status: 500 }
    );
  }
}
