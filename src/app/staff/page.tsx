"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Instagram, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const staff = [
    {
        id: 1,
        name: "Elena Rossi",
        role: "Senior Stylist",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        bio: "Elena specializes in avant-garde cuts and color correction. With 10 years of experience in Milan and NYC.",
        specialties: ["Hair Coloring", "Bridal Styling", "Precision Cuts"],
    },
    {
        id: 2,
        name: "Marco Vitti",
        role: "Master Barber",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        bio: "Marco brings the classic Italian barbering tradition to modern styles. Expert in fades and beard sculpting.",
        specialties: ["Hot Towel Shave", "Fades", "Beard Grooming"],
    },
    {
        id: 3,
        name: "Sarah Jenkins",
        role: "Esthetician",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        bio: "Certified skincare expert focusing on holistic treatments and anti-aging therapies.",
        specialties: ["Facials", "Skin Analysis", "Microdermabrasion"],
    },
    {
        id: 4,
        name: "David Chen",
        role: "Stylist",
        image: "https://randomuser.me/api/portraits/men/86.jpg",
        bio: "David is known for his edgy, modern cuts and ability to work with all hair textures.",
        specialties: ["Textured Hair", "Modern Cuts", "Blowouts"],
    }
];

function FlipCard({ person }: { person: typeof staff[0] }) {
    return (
        <div className="group h-[400px] w-full [perspective:1000px]">
            <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                {/* Front */}
                <div className="absolute inset-0 h-full w-full rounded-2xl overflow-hidden shadow-xl [backface-visibility:hidden]">
                    <img
                        src={person.image}
                        alt={person.name}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 text-white">
                        <h3 className="text-2xl font-bold">{person.name}</h3>
                        <p className="text-primary font-medium">{person.role}</p>
                    </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 p-6 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col shadow-xl">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-foreground">{person.name}</h3>
                        <span className="text-sm text-primary">{person.role}</span>
                    </div>

                    <p className="text-sm text-foreground/70 mb-6 text-center italic">
                        "{person.bio}"
                    </p>

                    <div className="mb-auto">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                            {person.specialties.map(s => (
                                <span key={s} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-6">
                        <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><Instagram size={18} /></Link>
                        <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter size={18} /></Link>
                    </div>

                    <Link href={`/booking?staff=${person.id}`} className="mt-4">
                        <Button className="w-full flex items-center gap-2">
                            <Calendar size={16} /> Book Now
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function StaffPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16" data-aos="fade-up">
                    <h1 className="text-5xl font-bold mb-6">Meet Our Experts</h1>
                    <p className="text-foreground/70 max-w-2xl mx-auto">
                        Our team of dedicated professionals is here to provide you with the best beauty and grooming experience.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {staff.map((person, idx) => (
                        <motion.div
                            key={person.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <FlipCard person={person} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
