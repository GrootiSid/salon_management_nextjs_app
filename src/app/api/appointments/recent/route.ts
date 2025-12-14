import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';

export async function GET() {
    try {
        await dbConnect();
        // Fetch top 5 most recent appointments
        const appointments = await Appointment.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('service');

        return NextResponse.json({ success: true, data: appointments });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
