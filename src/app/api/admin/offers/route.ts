import { NextResponse } from 'next/server';
import connectToDB from '@/lib/db';
import Offer from '@/models/Offer';

export async function GET() {
    try {
        await connectToDB();
        const offers = await Offer.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: offers });
    } catch (error) {
        console.error("Failed to fetch offers:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch offers" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectToDB();
        const body = await req.json();

        // Basic validation
        if (!body.title || !body.code || !body.discountPercentage || !body.validUntil) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const newOffer = await Offer.create({
            ...body,
            status: 'sent' // Auto-send for now
        });

        // Mock Sending Email
        console.log(`📧 [MOCK EMAIL] Sending Offer "${(newOffer as any).title}" to all subscribers...`);
        console.log(`   Code: ${(newOffer as any).code} - ${(newOffer as any).discountPercentage}% OFF`);
        console.log(`   Valid until: ${new Date((newOffer as any).validUntil).toLocaleDateString()}`);

        return NextResponse.json({ success: true, data: newOffer });
    } catch (error) {
        console.error("Failed to create offer:", error);
        return NextResponse.json({ success: false, error: "Failed to create offer" }, { status: 500 });
    }
}
