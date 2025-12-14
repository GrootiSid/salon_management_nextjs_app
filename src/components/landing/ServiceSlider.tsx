"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Clock, Star } from "lucide-react";

interface Service {
    _id: string;
    name: string;
    category: string;
    price: number;
    duration: number;
    image: string;
    description: string;
}

export default function ServiceSlider() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('/api/services');
                const data = await res.json();
                if (data.success) {
                    setServices(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const displayServices = services.length > 0 ? services : [];

    if (!loading && displayServices.length === 0) return null;

    return (
        <section className="py-20 bg-background overflow-hidden relative">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div data-aos="fade-right">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Our Services</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                            Premium Treatments
                        </h2>
                    </div>
                    <Link href="/services" data-aos="fade-left">
                        <Button variant="outline" className="mt-4 md:mt-0 border-primary/30 hover:bg-primary/10 text-primary">
                            View All Services
                        </Button>
                    </Link>
                </div>

                <div data-aos="fade-up">
                    {loading ? (
                        <div className="flex gap-4 overflow-hidden">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="min-w-[300px] h-[400px] bg-card rounded-3xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={30}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            pagination={{ clickable: true, dynamicBullets: true }}
                            className="pb-12"
                        >
                            {displayServices.map((service, index) => (
                                <SwiperSlide key={service._id}>
                                    <div className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-primary/50 transition-colors duration-500">
                                        {/* Image */}
                                        <div className="absolute inset-0">
                                            <img
                                                src={service.image || "/images/service-default.jpg"}
                                                alt={service.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x500?text=Service')}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-primary text-sm font-medium tracking-wider uppercase">{service.category}</span>
                                                <div className="flex items-center text-gray-400 text-xs">
                                                    <Clock size={12} className="mr-1" /> {service.duration} mins
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                                            <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                {service.description}
                                            </p>

                                            <div className="flex justify-between items-center mt-4">
                                                <span className="text-2xl font-bold text-white">₹{service.price}</span>
                                                <Link href={`/booking?serviceId=${service._id}`}>
                                                    <Button size="sm" className="bg-white text-black hover:bg-primary hover:text-black border-none rounded-full px-6 transition-colors">
                                                        Book Now
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
        </section>
    );
}
