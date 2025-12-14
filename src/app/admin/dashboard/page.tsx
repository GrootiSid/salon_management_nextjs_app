"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import RecentOrders from "@/components/admin/RecentOrders";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeStaff: 0,
        totalServices: 0,
        revenueChartData: [] as { name: string, revenue: number }[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/dashboard/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                } else {
                    console.error("Failed to fetch dashboard stats");
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
                {(stats as any).isMockData && (
                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-600 dark:text-yellow-400 text-sm">
                        ⚠️ <strong>Database Connection Failed:</strong> Showing mock data. Please check your MongoDB connection or IP whitelist.
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Bookings", value: stats.totalBookings, change: "All time", icon: Calendar, color: "bg-blue-500" },
                    { label: "Total Revenue", value: `₹${stats.totalRevenue}`, change: "All time", icon: DollarSign, color: "bg-green-500" },
                    { label: "Active Staff", value: stats.activeStaff, change: "Current", icon: Users, color: "bg-purple-500" },
                    { label: "Total Services", value: stats.totalServices, change: "Available", icon: TrendingUp, color: "bg-orange-500" },
                ].map((stat) => (
                    <Card key={stat.label} className="flex items-center gap-4 p-6 border-none shadow-sm bg-white dark:bg-zinc-800">
                        <div className={`w-12 h-12 rounded-full ${stat.color} bg-opacity-10 flex items-center justify-center text-${stat.color.split('-')[1]}-500`}>
                            <stat.icon className="text-white" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <h3 className="text-2xl font-bold">{stat.value}</h3>
                            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-zinc-700 px-2 py-0.5 rounded-full">
                                {stat.change}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent Orders Section */}
            <RecentOrders />

            {/* Chart */}
            <Card className="p-6 bg-white dark:bg-zinc-800">
                <h3 className="text-xl font-bold mb-6">Revenue Analytics (Last 7 Days)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart data={stats.revenueChartData && stats.revenueChartData.length > 0 ? stats.revenueChartData : [{ name: 'No Data', revenue: 0 }]}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                            <Tooltip
                                contentStyle={{ background: '#333', border: 'none', borderRadius: '8px', color: '#fff' }}
                                cursor={{ fill: 'transparent' }}
                                formatter={(value: number) => [`₹${value}`, 'Revenue']}
                            />
                            <Bar dataKey="revenue" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
