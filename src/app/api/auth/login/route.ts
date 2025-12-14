import { NextResponse } from 'next/server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();

        // Safe JSON parsing
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        const { username, password } = body;

        // Validation
        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Check password
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create Token
        const token = await signToken({ sub: user._id, username: user.username, role: user.role });

        const response = NextResponse.json({ success: true });

        response.cookies.set('admin_token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        });

        return response;
    } catch (error: any) {
        console.error('Login Error:', error);

        // Return clearer error in dev, generic in prod
        const errorMessage = process.env.NODE_ENV === 'development'
            ? `Server Error: ${error.message}`
            : 'Internal Server Error';

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
