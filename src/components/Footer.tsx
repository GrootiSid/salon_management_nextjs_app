import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-background text-muted-foreground py-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-border" />

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-primary">
                            LuxeSalon
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Experience the art of beauty with our premium services and expert staff.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-primary transition-colors"><Instagram size={20} /></Link>
                            <Link href="#" className="hover:text-primary transition-colors"><Facebook size={20} /></Link>
                            <Link href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></Link>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-foreground">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/staff" className="hover:text-primary transition-colors">Our Team</Link></li>
                            <li><Link href="/booking" className="hover:text-primary transition-colors">Book Now</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-foreground">Contact Us</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <MapPin size={18} className="text-primary mt-0.5" />
                                <span>123 Beauty Avenue, <br />Fashion District, NYC</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={18} className="text-primary" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={18} className="text-primary" />
                                <span>hello@luxesalon.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-foreground">Newsletter</h4>
                        <p className="text-muted-foreground text-sm mb-4">Subscribe for latest updates and offers.</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-primary text-foreground"
                            />
                            <button className="bg-primary text-black px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors font-medium">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} LuxeSalon. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
