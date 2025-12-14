"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/Card";

interface Appointment {
    _id: string;
    customerName: string;
    service: { name: string; price: number } | string;
    date: string;
    time: string;
    status: string;
}

export default function RecentOrders() {
    const [orders, setOrders] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await fetch('/api/appointments/recent');
                const data = await res.json();
                if (data.success) {
                    setOrders(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecent();
    }, []);

    if (loading) return <div className="p-4">Loading recent bookings...</div>;

    return (
        <Card className="bg-white dark:bg-zinc-800 p-6">
            <h3 className="text-xl font-bold mb-4">Recent Bookings (Orders)</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-gray-500 border-b dark:border-gray-700">
                        <tr>
                            <th className="pb-3">Customer</th>
                            <th className="pb-3">Service</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Total</th>
                            <th className="pb-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-800">
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td className="py-3 font-medium">{order.customerName}</td>
                                <td className="py-3 text-gray-500 dark:text-gray-400">
                                    {typeof order.service === 'object' ? order.service.name : 'Service'}
                                </td>
                                <td className="py-3 text-gray-500 dark:text-gray-400">
                                    {format(new Date(order.date), 'MMM d')} @ {order.time}
                                </td>
                                <td className="py-3 font-bold">
                                    ₹{typeof order.service === 'object' ? order.service.price : '-'}
                                </td>
                                <td className="py-3 text-right">
                                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize
                     ${order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr><td colSpan={5} className="py-4 text-center text-gray-500">No recent orders</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
