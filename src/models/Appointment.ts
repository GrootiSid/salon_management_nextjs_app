import mongoose, { Schema, model, models } from 'mongoose';

const AppointmentSchema = new Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    staff: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // e.g., "10:00 AM"
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    billing: {
        amount: { type: Number },
        paymentMethod: { type: String, enum: ['cash', 'card', 'online'], default: 'cash' },
        invoiceDate: { type: Date }
    },
    notes: { type: String },
}, { timestamps: true });

const Appointment = models.Appointment || model('Appointment', AppointmentSchema);

export default Appointment;
