import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';

// POST: Create a new appointment
export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { customerName, email, phone, serviceId, staffId, date, time, notes } = body;

        // Basic Validation
        if (!customerName || !email || !serviceId || !staffId || !date || !time) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check for conflicts
        const conflict = await Appointment.findOne({
            staff: staffId,
            date: new Date(date),
            time: time,
            status: { $ne: 'cancelled' }
        });

        if (conflict) {
            return NextResponse.json({ error: 'Time slot already booked for this staff member.' }, { status: 409 });
        }

        // Create Appointment
        const newAppointment = await Appointment.create({
            customerName,
            email,
            phone,
            service: serviceId,
            staff: staffId,
            date: new Date(date),
            time,
            notes,
            status: 'pending'
        });

        return NextResponse.json({ success: true, appointment: newAppointment }, { status: 201 });

    } catch (error: any) {
        console.error('Booking Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// GET: Fetch appointments with pagination
export async function GET(req: Request) {
    try {
        try {
            await dbConnect();
        } catch (dbError) {
            console.error("Failed to connect to DB, serving mock data for appointments:", dbError);
            // Mock Data Fallback
            const mockAppointments = [
                {
                    _id: "mock_1",
                    customerName: "Alice Mock",
                    service: { name: "Haircut", duration: 45, price: 35 },
                    staff: { name: "John Doe" },
                    date: new Date(),
                    time: "10:00",
                    status: "confirmed"
                },
                {
                    _id: "mock_2",
                    customerName: "Bob Mock",
                    service: { name: "Beard Trim", duration: 30, price: 25 },
                    staff: { name: "Jane Doe" },
                    date: new Date(),
                    time: "11:00",
                    status: "pending"
                }
            ];

            return NextResponse.json({
                success: true,
                data: mockAppointments,
                pagination: {
                    total: 2,
                    page: 1,
                    limit: 10,
                    totalPages: 1
                },
                isMockData: true
            });
        }

        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');
        const staffId = searchParams.get('staffId');
        const id = searchParams.get('id');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        if (id) {
            const appointment = await Appointment.findById(id).populate('service staff');
            return NextResponse.json(appointment);
        }

        const query: any = {};
        if (date) query.date = new Date(date);
        if (staffId) query.staff = staffId;

        const total = await Appointment.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        const appointments = await Appointment.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('service staff');

        return NextResponse.json({
            success: true,
            data: appointments,
            pagination: {
                total,
                page,
                limit,
                totalPages
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH: Update status (Confirm, Complete, Cancel)
export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id, status, billing } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing ID or Status' }, { status: 400 });
        }

        const updateData: any = { status };
        if (status === 'completed' && billing) {
            updateData.billing = {
                ...billing,
                invoiceDate: new Date()
            };
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(id, updateData, { new: true });

        return NextResponse.json({ success: true, data: updatedAppointment });

    } catch (error) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
