"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag, Send, Clock, Plus, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Offer {
    _id: string;
    title: string;
    description: string;
    code: string;
    discountPercentage: number;
    validUntil: string;
    status: 'draft' | 'sent';
    createdAt: string;
}

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        code: "",
        discountPercentage: 10,
        validUntil: "",
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const res = await fetch('/api/admin/offers');
            const data = await res.json();
            if (data.success) {
                setOffers(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch offers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setOffers([data.data, ...offers]);
                setIsModalOpen(false);
                setFormData({ title: "", description: "", code: "", discountPercentage: 10, validUntil: "" });
            }
        } catch (error) {
            console.error("Failed to create offer:", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Promotional Offers</h1>
                    <p className="text-muted-foreground">Manage and send discounts to your clients.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={20} /> Create Offer
                </Button>
            </div>

            {/* List */}
            <div className="grid gap-6">
                {offers.map((offer) => (
                    <Card key={offer._id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-6 bg-card border-border">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-foreground">{offer.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${offer.status === 'sent'
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                    {offer.status === 'sent' ? 'Sent' : 'Draft'}
                                </span>
                            </div>
                            <p className="text-muted-foreground">{offer.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                                <span className="flex items-center gap-1">
                                    <Tag size={14} className="text-primary" />
                                    Code: <strong className="text-foreground tracking-wider">{offer.code}</strong>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={14} className="text-primary" />
                                    Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-xl border border-primary/10 min-w-[120px]">
                            <span className="text-3xl font-bold text-primary">{offer.discountPercentage}%</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Discount</span>
                        </div>
                    </Card>
                ))}

                {!loading && offers.length === 0 && (
                    <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                        <Tag className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                        <h3 className="text-lg font-medium text-foreground">No Offers Created</h3>
                        <p className="text-muted-foreground">Start by creating your first promotional campaign.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h2 className="text-xl font-bold">Create New Offer</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateOffer} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Offer Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Summer Special Sale"
                                        className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 text-foreground outline-none"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        required
                                        placeholder="Describe the offer details..."
                                        rows={3}
                                        className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 text-foreground outline-none resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Discount Code</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="SUMMER20"
                                            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 text-foreground outline-none uppercase"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Discount (%)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            max="100"
                                            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 text-foreground outline-none"
                                            value={formData.discountPercentage}
                                            onChange={(e) => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Valid Until</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 text-foreground outline-none"
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                                        <Send size={16} /> Send Offer
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
