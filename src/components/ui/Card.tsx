"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "./Button";

interface CardProps extends HTMLMotionProps<"div"> {
    hoverEffect?: "scale" | "lift" | "none";
    glass?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, hoverEffect = "lift", glass = true, ...props }, ref) => {

        const hoverVariants = {
            scale: { scale: 1.02 },
            lift: { y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" },
            none: {},
        };

        return (
            <motion.div
                ref={ref}
                whileHover={hoverEffect !== "none" ? hoverVariants[hoverEffect] : undefined}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                    "rounded-2xl p-6",
                    glass ? "glass" : "bg-card text-card-foreground shadow-sm",
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = "Card";

export { Card };
