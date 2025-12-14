import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Staff from '@/models/Staff';

export async function GET() {
    try {
        await dbConnect();
        const staff = await Staff.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: staff });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Basic validation
        if (!body.name || !body.role) {
            return NextResponse.json({ error: 'Name and Role are required' }, { status: 400 });
        }

        const newStaff = await Staff.create(body);
        return NextResponse.json({ success: true, data: newStaff }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
    }
}
