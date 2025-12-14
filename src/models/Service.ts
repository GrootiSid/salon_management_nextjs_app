import mongoose, { Schema, model, models } from 'mongoose';

const ServiceSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // 'Hair', 'Beard', 'Facial', etc.
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // in minutes
    image: { type: String, default: '/images/service-default.jpg' },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

const Service = models.Service || model('Service', ServiceSchema);

export default Service;
