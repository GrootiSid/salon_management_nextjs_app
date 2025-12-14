"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Trash2, X, Star, Quote } from "lucide-react";

interface Review {
    _id: string;
    clientName: string;
    content: string;
    rating: number;
    image: string;
    designation: string;
}

export default function AdminReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        clientName: "",
        content: "",
        rating: 5,
        image: "",
        designation: ""
    });

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/reviews');
            const data = await res.json();
            if (data.success) {
                setReviews(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setFormData({ clientName: "", content: "", rating: 5, image: "", designation: "" });
                fetchReviews();
            } else {
                alert("Failed to save review");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchReviews();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Client Reviews</h1>
                <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white">
                    <Plus size={20} className="mr-2" /> Add Review
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <p>Loading reviews...</p> : reviews.map((review) => (
                    <Card key={review._id} className="p-6 bg-white dark:bg-zinc-800 relative group border-none shadow-sm hover:shadow-md transition-shadow">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDelete(review._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <Quote className="text-primary/20 mb-4 h-8 w-8" />
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-4 italic">"{review.content}"</p>
                        <div className="flex items-center gap-4">
                            <img
                                src={review.image || "/images/client-default.jpg"}
                                alt={review.clientName}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100?text=User')}
                            />
                            <div>
                                <h4 className="font-bold text-sm">{review.clientName}</h4>
                                <p className="text-xs text-gray-500">{review.designation}</p>
                                <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white">
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6">Add Client Review</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Client Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                                    value={formData.clientName}
                                    onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Designation</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Regular Customer"
                                    className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                                    value={formData.designation}
                                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    required
                                    className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                                    value={formData.rating}
                                    onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Review Content</label>
                                <textarea
                                    rows={4}
                                    required
                                    className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <Button type="submit" className="w-full bg-primary text-white mt-4">
                                Save Review
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
