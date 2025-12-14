import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const params = await props.params;
        const deletedReview = await Review.findByIdAndDelete(params.id);

        if (!deletedReview) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}
