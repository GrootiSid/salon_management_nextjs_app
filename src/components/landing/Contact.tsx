"use client";

import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12">

                {/* Contact Info & Form */}
                <div data-aos="fade-right">
                    <span className="text-primary font-semibold tracking-wider text-sm">GET IN TOUCH</span>
                    <h2 className="text-4xl font-bold mt-2 mb-6">Visit Our Salon</h2>
                    <p className="text-foreground/70 mb-8 max-w-md">
                        Have questions or need a custom package? Reach out to us or drop by our salon for a consultation.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6 mb-12">
                        <div className="flex items-start gap-3">
                            <MapPin className="text-primary w-6 h-6 mt-1" />
                            <div>
                                <h4 className="font-bold mb-1">Location</h4>
                                <p className="text-sm text-foreground/70">123 Beauty Avenue,<br />Fashion District, NYC 10001</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Phone className="text-primary w-6 h-6 mt-1" />
                            <div>
                                <h4 className="font-bold mb-1">Phone</h4>
                                <p className="text-sm text-foreground/70">+1 (555) 123-4567<br />+1 (555) 987-6543</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Mail className="text-primary w-6 h-6 mt-1" />
                            <div>
                                <h4 className="font-bold mb-1">Email</h4>
                                <p className="text-sm text-foreground/70">hello@luxesalon.com<br />bookings@luxesalon.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="text-primary w-6 h-6 mt-1" />
                            <div>
                                <h4 className="font-bold mb-1">Hours</h4>
                                <p className="text-sm text-foreground/70">Mon-Sat: 9am - 8pm<br />Sun: 10am - 6pm</p>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-4 max-w-md">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Name" className="w-full bg-white/5 border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                            <input type="email" placeholder="Email" className="w-full bg-white/5 border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <textarea placeholder="Message" rows={4} className="w-full bg-white/5 border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"></textarea>
                        <Button className="w-full">Send Message</Button>
                    </form>
                </div>

                {/* Map */}
                <div className="h-[500px] w-full rounded-3xl overflow-hidden glass p-2" data-aos="fade-left">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459426!3d40.73061007932822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0, borderRadius: '20px', filter: 'grayscale(0.8) contrast(1.2)' }}
                        allowFullScreen={true}
                        loading="lazy"
                    ></iframe>
                </div>

            </div>
        </section>
    );
}
