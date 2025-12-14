"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Quote, Star } from "lucide-react";

interface Review {
    _id: string;
    clientName: string;
    content: string;
    rating: number;
    image: string;
    designation: string;
}

export default function Testimonials() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch('/api/reviews');
                const data = await res.json();
                if (data.success) {
                    setReviews(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const displayReviews = reviews.length > 0 ? reviews : [];

    if (!loading && displayReviews.length === 0) return null;

    return (
        <section className="py-20 bg-primary/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16" data-aos="fade-up">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm">Testimonials</span>
                    <h2 className="text-3xl md:text-5xl font-bold mt-2 text-foreground">What Our Clients Say</h2>
                </div>

                <div data-aos="fade-up">
                    {loading ? (
                        <div className="flex gap-4 overflow-hidden">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="min-w-[300px] h-[300px] bg-card rounded-3xl animate-pulse"></div>
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
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            pagination={{ clickable: true, dynamicBullets: true }}
                            className="pb-16"
                        >
                            {displayReviews.map((review, index) => (
                                <SwiperSlide key={review._id}>
                                    <div className="bg-card p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 h-full flex flex-col border border-border">
                                        <div className="flex items-center gap-1 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} className={i < review.rating ? "text-primary fill-primary" : "text-muted"} />
                                            ))}
                                        </div>

                                        <div className="relative mb-6 flex-grow">
                                            <Quote className="absolute -top-2 -left-2 text-primary/20 w-12 h-12 rotate-180" />
                                            <p className="text-muted-foreground italic relative z-10 leading-relaxed">
                                                "{review.content}"
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border">
                                            <img
                                                src={review.image || "/images/client-default.jpg"}
                                                alt={review.clientName}
                                                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100?text=User')}
                                            />
                                            <div>
                                                <h4 className="font-bold text-foreground">{review.clientName}</h4>
                                                <p className="text-xs text-primary font-medium uppercase tracking-wide">{review.designation}</p>
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
