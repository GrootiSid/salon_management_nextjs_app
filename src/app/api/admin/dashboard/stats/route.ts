import { NextResponse } from 'next/server';
import connectToDB from '@/lib/db';
import Appointment from '@/models/Appointment';
import Staff from '@/models/Staff';
import Service from '@/models/Service';

export async function GET() {
    try {
        try {
            await connectToDB();
        } catch (dbError) {
            console.error("Failed to connect to DB, serving mock data:", dbError);
            // Return Mock Data if DB fails
            return NextResponse.json({
                totalBookings: 124,
                totalRevenue: 5430,
                activeStaff: 8,
                totalServices: 12,
                revenueChartData: [
                    { name: "Mon", revenue: 400 },
                    { name: "Tue", revenue: 300 },
                    { name: "Wed", revenue: 550 },
                    { name: "Thu", revenue: 450 },
                    { name: "Fri", revenue: 700 },
                    { name: "Sat", revenue: 900 },
                    { name: "Sun", revenue: 850 },
                ],
                isMockData: true
            });
        }

        // 1. Total Bookings
        const totalBookings = await Appointment.countDocuments();

        // 2. Total Revenue (sum of billing.amount for completed appointments)
        const revenueResult = await Appointment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: "$billing.amount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // 3. Active Staff
        const activeStaff = await Staff.countDocuments({ available: true });

        // 4. Total Services
        const totalServices = await Service.countDocuments();

        // 5. Revenue Chart Data (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const revenueChartData = await Appointment.aggregate([
            {
                $match: {
                    status: 'completed',
                    updatedAt: { $gte: sevenDaysAgo } // Using updatedAt for completion time approx
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                    revenue: { $sum: "$billing.amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const formattedChartData = revenueChartData.map(item => {
            const date = new Date(item._id);
            return {
                name: date.toLocaleDateString('en-US', { weekday: 'short' }), // "Mon", "Tue"
                revenue: item.revenue
            };
        });

        // Ensure we always return an array, even if empty
        const finalChartData = formattedChartData.length > 0 ? formattedChartData : [{ name: 'No Data', revenue: 0 }];

        return NextResponse.json({
            totalBookings,
            totalRevenue,
            activeStaff,
            totalServices,
            revenueChartData: finalChartData,
            isMockData: false
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Fallback catch-all
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
