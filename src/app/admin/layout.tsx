"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Users, Scissors, LogOut, Tag } from "lucide-react";

const sidebarLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar },
    { name: "Staff", href: "/admin/staff", icon: Users },
    { name: "Services", href: "/admin/services", icon: Scissors },
    { name: "Offers", href: "/admin/offers", icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Mock checking auth, redirect if not logged in (omitted for brevity in this step)

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/admin/login';
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Sidebar */}
            <aside className="w-64 bg-background border-r border-border hidden md:flex flex-col">
                <div className="p-6 border-b border-border">
                    <h1 className="text-2xl font-bold text-primary">
                        LuxeAdmin
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-secondary text-white shadow-md shadow-secondary/20"
                                    : "text-muted-foreground hover:bg-muted hover:text-white"
                                    }`}
                            >
                                <link.icon size={20} />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 overflow-y-auto pt-20 px-8 pb-12">
                {children}
            </main>
        </div>
    );
}
