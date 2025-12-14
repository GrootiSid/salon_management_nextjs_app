"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, CheckCircle, XCircle, FileText, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function AdminAppointments() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchAppointments = async (pageNum: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/appointments?page=${pageNum}&limit=10`);
            const data = await res.json();
            if (data.success) {
                setAppointments(data.data);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments(page);
    }, [page]);

    const updateStatus = async (id: string, status: string) => {
        if (status === 'completed' && !confirm(`Mark this appointment as ${status}?`)) return;
        if (status === 'cancelled' && !confirm(`Are you sure you want to cancel this appointment?`)) return;

        // Optimistic UI Update
        const previousAppointments = [...appointments];
        setAppointments(prev => prev.map(apt =>
            apt._id === id ? { ...apt, status } : apt
        ));

        try {
            const res = await fetch('/api/appointments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    status,
                    billing: status === 'completed' ? {
                        amount: 0, // This would ideally come from the service price
                        paymentMethod: 'cash'
                    } : undefined
                }),
            });

            if (!res.ok) {
                // Revert on failure
                setAppointments(previousAppointments);
                alert("Failed to update status");
            }
            // No need to fetchAppointments() again as we already updated optimistically
        } catch (error) {
            console.error(error);
            setAppointments(previousAppointments);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Appointments</h1>
            </div>

            <div className="grid gap-4">
                {loading && appointments.length === 0 ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-zinc-800 p-6 rounded-xl h-24 animate-pulse"></div>
                        ))}
                    </div>
                ) : appointments.map((apt) => (
                    <div key={apt._id} className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300">
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                                ${apt.status === 'confirmed' ? 'bg-green-500' : apt.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'}
                            `}>
                                {apt.customerName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{apt.customerName}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                                    <Calendar size={14} /> {format(new Date(apt.date), "PPP")}
                                    <Clock size={14} className="ml-2" /> {apt.time}
                                </p>
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                    <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded">
                                        {apt.service?.name}
                                    </span>
                                    <span className="text-gray-500">with {apt.staff?.name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-auto">
                            {apt.status === 'pending' && (
                                <>
                                    <Button size="sm" onClick={() => updateStatus(apt._id, 'confirmed')} className="bg-green-600 hover:bg-green-700 transition-colors">
                                        <CheckCircle size={16} className="mr-2" /> Confirm
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => updateStatus(apt._id, 'cancelled')} className="text-red-500 border-red-500 hover:bg-red-50 transition-colors">
                                        <XCircle size={16} className="mr-2" /> Cancel
                                    </Button>
                                </>
                            )}

                            {apt.status === 'confirmed' && (
                                <Button size="sm" onClick={() => updateStatus(apt._id, 'completed')} className="bg-blue-600 hover:bg-blue-700 transition-colors">
                                    <DollarSign size={16} className="mr-2" /> Complete & Bill
                                </Button>
                            )}

                            {apt.status === 'completed' && (
                                <Link href={`/admin/invoices/${apt._id}`} target="_blank">
                                    <Button size="sm" variant="outline">
                                        <FileText size={16} className="mr-2" /> Print Invoice
                                    </Button>
                                </Link>
                            )}

                            <div className="ml-2 px-3 py-1 rounded bg-gray-100 dark:bg-zinc-900 capitalize text-sm font-medium">
                                {apt.status}
                            </div>
                        </div>
                    </div>
                ))}

                {!loading && appointments.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No appointments found.</div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        <ChevronLeft size={16} className="mr-2" /> Previous
                    </Button>
                    <span className="text-sm font-medium text-gray-500">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                        Next <ChevronRight size={16} className="ml-2" />
                    </Button>
                </div>
            )}
        </div>
    );
}
