"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, Filter, Clock } from "lucide-react";
import Link from "next/link";

// Mock Data
const servicesData = [
    { id: 1, name: "Classic Haircut", category: "Hair", price: 35, duration: 45, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80" },
    { id: 2, name: "Beard Trim & Shape", category: "Beard", price: 25, duration: 30, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80" },
    { id: 3, name: "Hot Works Shave", category: "Beard", price: 45, duration: 45, image: "https://images.unsplash.com/photo-1503951914875-452162b7f304?w=800&q=80" },
    { id: 4, name: "Deep Cleansing Facial", category: "Face", price: 65, duration: 60, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80" },
    { id: 5, name: "Hair Coloring", category: "Hair", price: 80, duration: 120, image: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=800&q=80" },
    { id: 6, name: "Relaxing Scalp Massage", category: "Spa", price: 40, duration: 30, image: "https://images.unsplash.com/photo-1519823551278-64ac927accc9?w=800&q=80" },
];

const categories = ["All", "Hair", "Beard", "Face", "Spa"];

export default function ServicesPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredServices = servicesData.filter(service => {
        const matchesCategory = activeCategory === "All" || service.category === activeCategory;
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-primary/5 py-20 pb-32 relative overflow-hidden">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-5xl font-bold mb-6">Our Services</h1>
                    <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
                        Explore our wide range of premium grooming services tailored just for you.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 -mt-20 relative z-20">

                {/* Controls */}
                <div className="glass rounded-2xl p-4 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat
                                        ? "bg-primary text-white shadow-md"
                                        : "bg-transparent text-foreground/70 hover:bg-black/5 dark:hover:bg-white/5"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
                    <AnimatePresence mode="popLayout">
                        {filteredServices.map((service) => (
                            <motion.div
                                layout
                                key={service.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="h-full flex flex-col p-0 overflow-hidden border-0 shadow-lg group">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                                            {service.category}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                                        <div className="flex items-center gap-2 text-foreground/60 text-sm mb-4">
                                            <Clock size={16} />
                                            <span>{service.duration} mins</span>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-dashed border-gray-200 dark:border-gray-800">
                                            <span className="text-2xl font-bold text-primary">${service.price}</span>
                                            <Link href={`/booking?service=${service.id}`}>
                                                <Button size="sm">Book</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredServices.length === 0 && (
                    <div className="text-center py-20 text-foreground/50">
                        <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No services found matching your criteria.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
