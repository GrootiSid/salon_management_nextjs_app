"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(false); // Using this as Men/Women toggle for Salon context or just generic toggle.
    // Actually, let's make it a Men / Women toggle as requested.
    const [targetAudience, setTargetAudience] = useState<"Men" | "Women">("Men");

    const plans = [
        {
            name: "Basic Grooming",
            price: targetAudience === "Men" ? 49 : 69,
            features: [
                "Haircut & Wash",
                "Beard/Eyebrow Trim",
                "Hot Towel Finish",
                targetAudience === "Men" ? "Neck Shave" : "Blow Dry",
            ],
            notIncluded: ["Facial", "Massage", "Premium Products"],
        },
        {
            name: "Premium Look",
            price: targetAudience === "Men" ? 89 : 129,
            popular: true,
            features: [
                "Everything in Basic",
                "Express Facial",
                "Scalp Massage (15m)",
                "Premium Styling Products",
                "Beverage Service",
            ],
            notIncluded: ["Full Spa Access"],
        },
        {
            name: "Royal Treatment",
            price: targetAudience === "Men" ? 149 : 199,
            features: [
                "Everything in Premium",
                "Full Deep Cleansing Facial",
                "Manicure / Pedicure",
                "Shoulder & Neck Massage",
                "Take-home Product Kit",
            ],
            notIncluded: [],
        },
    ];

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 bg-background">
            <div className="text-center mb-16" data-aos="fade-up">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
                <p className="text-foreground/70 text-lg mb-8">Choose the package that suits you best.</p>

                {/* Toggle */}
                <div className="inline-flex items-center p-1 bg-muted rounded-full cursor-pointer relative">
                    <motion.div
                        layout
                        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-card rounded-full shadow-sm z-0"
                        animate={{ left: targetAudience === "Men" ? 4 : "50%" }}
                    />
                    <button
                        onClick={() => setTargetAudience("Men")}
                        className={`relative z-10 px-8 py-2 rounded-full text-sm font-medium transition-colors ${targetAudience === "Men" ? "text-foreground" : "text-foreground/60"}`}
                    >
                        Men
                    </button>
                    <button
                        onClick={() => setTargetAudience("Women")}
                        className={`relative z-10 px-8 py-2 rounded-full text-sm font-medium transition-colors ${targetAudience === "Women" ? "text-foreground" : "text-foreground/60"}`}
                    >
                        Women
                    </button>
                </div>
            </div>

            <div className="container mx-auto grid md:grid-cols-3 gap-8 max-w-6xl">
                {plans.map((plan, index) => (
                    <Card
                        key={plan.name}
                        className={`relative p-8 flex flex-col ${plan.popular ? 'border-primary ring-2 ring-primary/20 scale-105 z-10' : 'border-border'}`}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                        glass={true}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <div className="flex items-baseline mb-8">
                            <span className="text-4xl font-bold">$</span>
                            <span className="text-6xl font-bold tracking-tight">{plan.price}</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center shrink-0">
                                        <Check size={12} />
                                    </div>
                                    <span className="text-foreground/80 text-sm">{feature}</span>
                                </li>
                            ))}
                            {plan.notIncluded.map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-foreground/40">
                                    <div className="w-5 h-5 rounded-full bg-gray-500/10 text-gray-400 flex items-center justify-center shrink-0">
                                        <X size={12} />
                                    </div>
                                    <span className="text-sm line-through">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            className="w-full"
                            variant={plan.popular ? "primary" : "outline"}
                        >
                            Choose Plan
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
