"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";

interface Staff {
    _id: string;
    name: string;
    role: string;
    experience: number;
    specialties: string[];
    image: string;
}

export default function StaffSection() {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await fetch('/api/staff');
                const data = await res.json();
                if (data.success) {
                    setStaffList(data.data.filter((s: any) => s.available));
                }
            } catch (error) {
                console.error("Failed to fetch staff:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    if (!loading && staffList.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50 dark:bg-zinc-900/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
                        Meet Our Experts
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Highly skilled professionals dedicated to perfecting your look with years of experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="h-[400px] bg-white dark:bg-zinc-800 rounded-2xl animate-pulse"></div>
                        ))
                    ) : (
                        staffList.map((staff, index) => (
                            <div
                                key={staff._id}
                                className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                {/* Image Background */}
                                <div className="absolute inset-0">
                                    <img
                                        src={staff.image || "/images/staff-default.jpg"}
                                        alt={staff.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x500?text=Expert')}
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="bg-amber-400 w-12 h-1 mb-4 rounded-full"></div>
                                    <h3 className="text-2xl font-bold text-white mb-1">{staff.name}</h3>
                                    <p className="text-amber-300 font-medium mb-2">{staff.role}</p>

                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        <p className="text-gray-300 text-sm mb-3">{staff.experience} Years Experience</p>
                                        <div className="flex flex-wrap gap-2">
                                            {staff.specialties.slice(0, 3).map((spec, i) => (
                                                <span key={i} className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full border border-white/10">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
