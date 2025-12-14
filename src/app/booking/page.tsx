"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { CheckCircle, Calendar as CalendarIcon, Clock, User, Scissors } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

// Steps: 0: Service, 1: Staff, 2: Date, 3: Info & OTP, 4: Success
export default function BookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
            <BookingContent />
        </Suspense>
    );
}

function BookingContent() {
    const [step, setStep] = useState(0);
    const [services, setServices] = useState<any[]>([]);
    const [staffList, setStaffList] = useState<any[]>([]);
    // ... rest of the component ...

    // Booking State
    const [bookingData, setBookingData] = useState<any>({
        service: null,
        staff: null,
        date: undefined,
        time: null,
        customerName: "",
        email: "",
        phone: "",
        otp: "",
    });
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

    const searchParams = useSearchParams();
    const preSelectedServiceId = searchParams.get('serviceId');

    // Fetch Data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [sRes, stRes] = await Promise.all([
                    fetch('/api/services'),
                    fetch('/api/staff')
                ]);

                let fetchedServices = [];
                if (sRes.ok) {
                    const sData = await sRes.json();
                    fetchedServices = sData.success ? sData.data : [];
                    setServices(fetchedServices);
                }

                if (stRes.ok) {
                    const stData = await stRes.json();
                    setStaffList(stData.success ? stData.data : []);
                }

                // Pre-select service if ID is in URL
                if (preSelectedServiceId && fetchedServices.length > 0) {
                    const foundService = fetchedServices.find((s: any) => s._id === preSelectedServiceId);
                    if (foundService) {
                        setBookingData((prev: any) => ({ ...prev, service: foundService }));
                    }
                }

            } catch (e) {
                console.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [preSelectedServiceId]);

    const handleNext = async () => {
        // Step 3: OTP Logic (Mocked)
        if (step === 3 && !otpSent) {
            if (!bookingData.customerName || !bookingData.email || !bookingData.phone) {
                alert("Please fill in all details");
                return;
            }
            setOtpSent(true);
            alert("Your OTP is 1234");
            return;
        }

        // Step 3: Submit Booking
        if (step === 3 && otpSent) {
            if (bookingData.otp === "1234") {
                setLoading(true);
                try {
                    const res = await fetch('/api/appointments', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            customerName: bookingData.customerName,
                            email: bookingData.email,
                            phone: bookingData.phone,
                            serviceId: bookingData.service._id,
                            staffId: bookingData.staff._id,
                            date: bookingData.date,
                            time: bookingData.time
                        })
                    });

                    if (res.ok) {
                        setStep(4);
                    } else {
                        const err = await res.json();
                        alert(err.error || "Booking failed");
                    }
                } catch (error) {
                    alert("Something went wrong");
                } finally {
                    setLoading(false);
                }
            } else {
                alert("Invalid OTP");
            }
            return;
        }
        setStep((prev) => prev + 1);
    };

    const handleBack = () => setStep((prev) => prev - 1);

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 flex justify-center items-start bg-background">
            <div className="max-w-4xl w-full grid md:grid-cols-3 gap-8">

                {/* Progress Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    <div className="space-y-4">
                        {["Service", "Staff", "Date & Time", "Details"].map((label, idx) => (
                            <div key={label} className={cn("flex items-center gap-3", idx === step ? "text-primary" : idx < step ? "text-green-500" : "text-gray-400")}>
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border", idx === step ? "border-primary" : idx < step ? "bg-green-500 border-green-500 text-white" : "border-gray-600")}>
                                    {idx < step ? <CheckCircle size={14} /> : idx + 1}
                                </div>
                                <span className="font-medium">{label}</span>
                            </div>
                        ))}
                    </div>

                    {(bookingData.service || bookingData.date) && (
                        <Card className="bg-primary/5 border border-primary/20 p-4 space-y-2">
                            <h4 className="font-bold mb-2">Summary</h4>
                            {bookingData.service && <p className="text-sm">✂ {bookingData.service.name}</p>}
                            {bookingData.staff && <p className="text-sm">👤 {bookingData.staff.name}</p>}
                            {bookingData.date && <p className="text-sm">📅 {format(bookingData.date, "PPP")}</p>}
                            {bookingData.time && <p className="text-sm">⏰ {bookingData.time}</p>}
                        </Card>
                    )}
                </div>

                {/* Main Content */}
                <Card className="md:col-span-2 p-8 min-h-[500px] relative overflow-hidden glass">
                    <AnimatePresence mode="wait">

                        {/* Step 0: Service */}
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <h2 className="text-2xl font-bold mb-6">Select Service</h2>
                                <div className="grid gap-4">
                                    {services.map(service => (
                                        <div
                                            key={service._id}
                                            onClick={() => setBookingData({ ...bookingData, service })}
                                            className={cn("p-4 rounded-xl border cursor-pointer hover:border-primary transition-colors flex justify-between items-center", bookingData.service?._id === service._id ? "border-primary bg-primary/10" : "border-white/10")}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                                    <Scissors size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{service.name}</h4>
                                                    <p className="text-sm text-gray-500">{service.duration} mins</p>
                                                </div>
                                            </div>
                                            <span className="font-bold">₹{service.price}</span>
                                        </div>
                                    ))}
                                    {loading && <p className="text-center text-gray-500">Loading services...</p>}
                                    {!loading && services.length === 0 && <p className="text-center text-gray-500">No services available. Please check back later.</p>}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 1: Staff */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <h2 className="text-2xl font-bold mb-6">Choose Professional</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {staffList.map(s => (
                                        <div
                                            key={s._id}
                                            onClick={() => setBookingData({ ...bookingData, staff: s })}
                                            className={cn("p-4 rounded-xl border cursor-pointer hover:border-primary transition-colors text-center", bookingData.staff?._id === s._id ? "border-primary bg-primary/10" : "border-white/10")}
                                        >
                                            <User className="mx-auto mb-2" />
                                            <h4>{s.name}</h4>
                                            <p className="text-xs text-gray-500">{s.role}</p>
                                        </div>
                                    ))}
                                    {loading && <p className="col-span-2 text-center text-gray-500">Loading staff...</p>}
                                    {!loading && staffList.length === 0 && <p className="col-span-2 text-center text-gray-500">No staff available.</p>}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Date & Time */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold mb-4">Select Date & Time</h2>
                                <div className="flex flex-col md:flex-row gap-8 justify-center">
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <DayPicker
                                            mode="single"
                                            selected={bookingData.date}
                                            onSelect={(date) => setBookingData({ ...bookingData, date })}
                                            disabled={{ before: new Date() }}
                                            modifiersClassNames={{
                                                selected: "bg-primary text-white hover:bg-primary",
                                                today: "text-primary font-bold"
                                            }}
                                        />
                                    </div>

                                    {bookingData.date && (
                                        <div className="flex-1">
                                            <h4 className="font-bold mb-4">Available Slots</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {timeSlots.map(time => (
                                                    <button
                                                        key={time}
                                                        onClick={() => setBookingData({ ...bookingData, time })}
                                                        className={cn("py-2 px-4 rounded-lg text-sm border hover:border-primary transition-all", bookingData.time === time ? "bg-primary text-white border-primary" : "border-white/10")}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Details & OTP */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <h2 className="text-2xl font-bold mb-6">Your Information</h2>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={bookingData.customerName}
                                    onChange={(e) => setBookingData({ ...bookingData, customerName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={bookingData.email}
                                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={bookingData.phone}
                                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                                />

                                {otpSent && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="bg-primary/10 p-4 rounded-xl border border-primary/20"
                                    >
                                        <p className="text-sm mb-2 text-primary">Enter OTP sent to your phone (Use 1234)</p>
                                        <input
                                            type="text"
                                            placeholder="OTP"
                                            value={bookingData.otp}
                                            onChange={(e) => setBookingData({ ...bookingData, otp: e.target.value })}
                                            className="w-full bg-white border border-primary/20 rounded-lg px-4 py-2 focus:outline-none text-black tracking-widest text-center font-bold text-xl"
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Step 4: Success */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
                                    <CheckCircle size={40} className="text-white" />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
                                <p className="text-foreground/70 mb-8 max-w-md mx-auto">
                                    Your appointment has been successfully scheduled. We look forward to seeing you.
                                </p>
                                <Button onClick={() => window.location.reload()}>Book Another</Button>
                            </motion.div>
                        )}

                    </AnimatePresence>

                    {/* Navigation */}
                    {step < 4 && (
                        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                            <Button variant="ghost" onClick={handleBack} disabled={step === 0}>Back</Button>
                            <Button
                                onClick={handleNext}
                                disabled={
                                    (step === 0 && !bookingData.service) ||
                                    (step === 1 && !bookingData.staff) ||
                                    (step === 2 && (!bookingData.date || !bookingData.time)) ||
                                    loading
                                }
                            >
                                {step === 3 ? (loading ? "Booking..." : (otpSent ? "Confirm Booking" : "Send OTP")) : "Next Step"}
                            </Button>
                        </div>
                    )}
                </Card>

            </div>
        </div>
    );
}
