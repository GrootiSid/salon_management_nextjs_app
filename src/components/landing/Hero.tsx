"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Scissors, Wind, SprayCan } from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";



function FloatingIcon({ children, delay, x, y, rotate }: { children: React.ReactNode, delay: number, x: string, y: string, rotate: number }) {
    return (
        <motion.div
            className="absolute"
            style={{ left: x, top: y }}
            animate={{
                y: [0, -20, 0],
                rotate: [rotate, rotate + 10, rotate],
            }}
            transition={{
                duration: 4,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            <div className="bg-white/80 dark:bg-zinc-800/80 p-3 rounded-2xl backdrop-blur-md shadow-xl border border-white/20">
                {children}
            </div>
        </motion.div>
    );
}

// ... imports

// ... FloatingIcon component

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

            {/* Background Blobs (CSS Fallback/enhancement) */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000" />

            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-card border border-primary text-sm font-medium text-primary shadow-[0_0_10px_rgba(212,175,55,0.2)] backdrop-blur-sm">
                        ✨ Premium Salon Experience
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold leading-tight text-foreground">
                        Redefine Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                            Beauty Standard
                        </span>
                    </h1>

                    <p className="text-lg text-foreground/80 max-w-lg leading-relaxed">
                        Experience world-class hair, skin, and grooming services in a modern,
                        relaxing atmosphere equipped with the latest technology.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link href="/booking">
                            <Button size="lg" className="bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(212,175,55,0.4)] border-none">Book Appointment</Button>
                        </Link>
                        <Link href="/services">
                            <Button variant="outline" size="lg" className="border-secondary text-foreground hover:bg-secondary hover:text-white">View Services</Button>
                        </Link>
                    </div>

                    <div className="flex gap-8 pt-8 text-sm font-medium text-foreground/60">
                        <div>
                            <span className="block text-2xl font-bold text-foreground">500+</span>
                            Happy Clients
                        </div>
                        <div>
                            <span className="block text-2xl font-bold text-foreground">50+</span>
                            Top Stylists
                        </div>
                        <div>
                            <span className="block text-2xl font-bold text-foreground">4.9</span>
                            Star Rating
                        </div>
                    </div>
                </motion.div>

                {/* Right 3D Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-[400px] md:h-[500px] w-full relative flex items-center justify-center"
                >
                    {/* Abstract Shapes using CSS/Framer */}
                    <div className="relative w-full h-full max-w-[500px]">
                        <motion.div
                            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl border border-white/10"
                        />
                        <motion.div
                            animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full blur-2xl border border-white/10"
                        />

                        {/* Central Hero Image or Graphic could go here, for now using the icons */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-64 h-64 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl flex items-center justify-center">
                                <div className="text-center p-6">
                                    <h3 className="text-xl font-bold text-primary mb-2">LuxeSalon</h3>
                                    <p className="text-xs text-gray-400">Premium Experience</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Icons */}
                        <FloatingIcon delay={0} x="10%" y="20%" rotate={-10}>
                            <Scissors size={32} className="text-pink-500" />
                        </FloatingIcon>
                        <FloatingIcon delay={1} x="85%" y="15%" rotate={20}>
                            <Wind size={32} className="text-blue-400" />
                        </FloatingIcon>
                        <FloatingIcon delay={2} x="75%" y="75%" rotate={-15}>
                            <SprayCan size={32} className="text-purple-500" />
                        </FloatingIcon>
                        <FloatingIcon delay={1.5} x="15%" y="80%" rotate={10}>
                            <Scissors size={32} className="text-yellow-500" />
                        </FloatingIcon>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
