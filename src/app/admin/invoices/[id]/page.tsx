"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Printer } from 'lucide-react';

export default function InvoicePage() {
    const { id } = useParams();
    const [appointment, setAppointment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`/api/appointments?id=${id}`);
                const data = await res.json();
                setAppointment(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDetails();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Loading Invoice...</div>;
    if (!appointment) return <div className="p-10 text-center">Invoice not found</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start print:bg-white print:p-0">
            <div className="bg-white p-10 max-w-2xl w-full shadow-lg rounded-xl print:shadow-none">

                {/* Header */}
                <div className="flex justify-between items-start border-b pb-8 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#D4AF37]">LuxeSalon</h1>
                        <p className="text-gray-500 mt-2">123 Premium Street, Beverly Hills, CA 90210</p>
                        <p className="text-gray-500">Phone: (555) 123-4567</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
                        <p className="text-gray-500 mt-1">#{appointment._id.slice(-6).toUpperCase()}</p>
                        <p className="text-gray-500">Date: {format(new Date(), "PPP")}</p>
                    </div>
                </div>

                {/* Bill To */}
                <div className="mb-8">
                    <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">Bill To:</h3>
                    <h4 className="text-xl font-bold">{appointment.customerName}</h4>
                    <p className="text-gray-600">{appointment.email}</p>
                    <p className="text-gray-600">{appointment.phone}</p>
                </div>

                {/* Items */}
                <table className="w-full text-left mb-8">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="py-3 px-4 font-bold text-gray-600">Service Description</th>
                            <th className="py-3 px-4 font-bold text-gray-600 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="py-4 px-4">
                                <p className="font-bold">{appointment.service?.name}</p>
                                <p className="text-sm text-gray-500">Provided by {appointment.staff?.name}</p>
                            </td>
                            <td className="py-4 px-4 text-right font-bold">
                                ₹{appointment.service?.price}
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="py-4 px-4 text-right font-bold text-gray-600">Total</td>
                            <td className="py-4 px-4 text-right font-bold text-2xl text-[#D4AF37]">
                                ₹{appointment.service?.price}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {/* Footer */}
                <div className="border-t pt-8 text-center text-gray-500 text-sm">
                    <p>Thank you for choosing LuxeSalon. We hope to see you again soon!</p>
                </div>

                {/* Print Button (Hidden in Print) */}
                <div className="mt-8 text-center print:hidden">
                    <Button onClick={() => window.print()} className="flex items-center gap-2 mx-auto">
                        <Printer size={18} /> Print Invoice
                    </Button>
                </div>

            </div>
        </div>
    );
}
