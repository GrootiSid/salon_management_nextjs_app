import mongoose, { Schema, model, models } from 'mongoose';

const ReviewSchema = new Schema({
    clientName: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    image: { type: String, default: '/images/client-default.jpg' },
    designation: { type: String, default: 'Client' },
    approved: { type: Boolean, default: true },
}, { timestamps: true });

const Review = models.Review || model('Review', ReviewSchema);

export default Review;
