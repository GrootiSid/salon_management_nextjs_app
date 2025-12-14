import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';

export async function GET() {
    try {
        await dbConnect();
        const services = await Service.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: services });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        if (!body.name || !body.price || !body.duration) {
            return NextResponse.json({ error: 'Name, Price and Duration are required' }, { status: 400 });
        }

        const newService = await Service.create(body);
        return NextResponse.json({ success: true, data: newService }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}
