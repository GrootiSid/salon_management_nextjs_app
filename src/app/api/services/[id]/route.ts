import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const params = await props.params;
        const body = await req.json();
        const updatedService = await Service.findByIdAndUpdate(params.id, body, { new: true });

        if (!updatedService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedService });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const params = await props.params;
        const deletedService = await Service.findByIdAndDelete(params.id);

        if (!deletedService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
