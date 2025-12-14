"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Edit2, Trash2, X, Clock, DollarSign } from "lucide-react";

interface Service {
    _id: string;
    name: string;
    category: string;
    price: number;
    duration: number;
    image: string;
    description: string;
    featured: boolean;
}

export default function AdminServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        category: "Hair",
        price: 0,
        duration: 30,
        image: "",
        description: "",
        featured: false
    });

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/services');
            const data = await res.json();
            if (data.success) {
                setServices(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleOpenModal = (service?: Service) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name,
                category: service.category,
                price: service.price,
                duration: service.duration,
                image: service.image,
                description: service.description,
                featured: service.featured
            });
        } else {
            setEditingService(null);
            setFormData({ name: "", category: "Hair", price: 0, duration: 30, image: "", description: "", featured: false });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingService ? 'PUT' : 'POST';
            const url = editingService ? `/api/services/${editingService._id}` : '/api/services';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchServices();
            } else {
                alert("Failed to save service");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        try {
            const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchServices();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Service Management</h1>
                <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90 text-white">
                    <Plus size={20} className="mr-2" /> Add Service
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <p>Loading services...</p> : services.map((service) => (
                    <Card key={service._id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-none bg-white dark:bg-zinc-800" data-aos="fade-up">
                        <div className="relative h-48 w-full bg-gray-200">
                            <img
                                src={service.image || "/images/service-default.jpg"}
                                alt={service.name}
                                className="object-cover w-full h-full"
                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Service')}
                            />
                            {service.featured && (
                                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow">
                                    FEATURED
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(service)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-blue-600">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(service._id)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-red-600">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold">{service.name}</h3>
                                <span className="text-sm bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded text-gray-500">
                                    {service.category}
                                </span>
                            </div>
                            <p className="text-gray-500 line-clamp-2 text-sm mb-4">{service.description}</p>

                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="flex items-center text-primary">
                                    <DollarSign size={16} className="mr-1" /> ₹{service.price}
                                </span>
                                <span className="flex items-center text-gray-500">
                                    <Clock size={16} className="mr-1" /> {service.duration} mins
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white">
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6">{editingService ? 'Edit Service' : 'Add New Service'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Service Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select
                                        className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Hair">Hair</option>
                                        <option value="Beard">Beard</option>
                                        <option value="Facial">Facial</option>
                                        <option value="Massage">Massage</option>
                                        <option value="Treatment">Treatment</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration (mins)</label>
                                    <input
                                        type="number"
                                        min="5"
                                        step="5"
                                        required
                                        className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
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
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="featured">Feature this service on homepage</label>
                            </div>

                            <Button type="submit" className="w-full bg-primary text-white mt-4">
                                {editingService ? 'Update Service' : 'Add Service'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
