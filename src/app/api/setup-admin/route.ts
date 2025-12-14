import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    await dbConnect();

    const username = 'admin';
    const password = 'admin@123';

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            existingUser.password = await hashPassword(password);
            await existingUser.save();
            return NextResponse.json({ message: 'Admin user updated', username });
        }

        const hashedPassword = await hashPassword(password);
        await User.create({
            username,
            password: hashedPassword,
            role: 'admin'
        });

        return NextResponse.json({ message: 'Admin user created successfully', username });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
