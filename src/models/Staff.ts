import mongoose, { Schema, model, models } from 'mongoose';

const StaffSchema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true }, // 'Senior Stylist', 'Barber', etc.
    email: { type: String },
    bio: { type: String },
    experience: { type: Number, default: 0 }, // Years of experience
    image: { type: String, default: '/images/staff-default.jpg' },
    specialties: [{ type: String }],
    available: { type: Boolean, default: true },
}, { timestamps: true });

const Staff = models.Staff || model('Staff', StaffSchema);

export default Staff;
