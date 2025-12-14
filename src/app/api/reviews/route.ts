import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

export async function GET() {
    try {
        await dbConnect();
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: reviews });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        if (!body.clientName || !body.content) {
            return NextResponse.json({ error: 'Client Name and Content are required' }, { status: 400 });
        }

        const newReview = await Review.create(body);
        return NextResponse.json({ success: true, data: newReview }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}
