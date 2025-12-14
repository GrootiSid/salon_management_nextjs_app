import mongoose, { Schema, Document } from 'mongoose';

export interface IOffer extends Document {
    title: string;
    description: string;
    code: string;
    discountPercentage: number;
    validUntil: Date;
    status: 'draft' | 'sent';
    createdAt: Date;
}

const OfferSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        code: { type: String, required: true, uppercase: true },
        discountPercentage: { type: Number, required: true, min: 0, max: 100 },
        validUntil: { type: Date, required: true },
        status: { type: String, enum: ['draft', 'sent'], default: 'draft' },
    },
    { timestamps: true }
);

export default mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);
