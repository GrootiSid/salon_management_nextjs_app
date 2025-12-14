"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import Image from "next/image";

interface Staff {
    _id: string;
    name: string;
    role: string;
    experience: number;
    specialties: string[];
    image: string;
    available: boolean;
}

export default function AdminStaff() {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        experience: 0,
        specialties: "",
        image: ""
    });

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/staff');
            const data = await res.json();
            if (data.success) {
                setStaffList(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleOpenModal = (staff?: Staff) => {
        if (staff) {
            setEditingStaff(staff);
            setFormData({
                name: staff.name,
                role: staff.role,
                experience: staff.experience || 0,
                specialties: staff.specialties.join(", "),
                image: staff.image
            });
        } else {
            setEditingStaff(null);
            setFormData({ name: "", role: "", experience: 0, specialties: "", image: "" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s)
        };

        try {
            const method = editingStaff ? 'PUT' : 'POST';
            const url = editingStaff ? `/api/staff/${editingStaff._id}` : '/api/staff';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchStaff();
            } else {
                alert("Failed to save staff");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this staff member?")) return;
        try {
            const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchStaff();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Staff Management</h1>
                <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90 text-white">
                    <Plus size={20} className="mr-2" /> Add Staff
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <p>Loading staff...</p> : staffList.map((staff) => (
                    <Card key={staff._id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-none bg-white dark:bg-zinc-800" data-aos="fade-up">
                        <div className="relative h-48 w-full bg-gray-200">
                            {/* Placeholder or real image */}
                            <img
                                src={staff.image || "/images/staff-default.jpg"}
                                alt={staff.name}
                                className="object-cover w-full h-full"
                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image')}
                            />
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(staff)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-blue-600">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(staff._id)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-red-600">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-xl font-bold">{staff.name}</h3>
                            <p className="text-primary font-medium text-sm">{staff.role}</p>
                            <p className="text-gray-500 text-xs mt-1">{staff.experience} Years Experience</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {staff.specialties.slice(0, 3).map((spec, i) => (
                                    <span key={i} className="text-xs bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded">
                                        {spec}
                                    </span>
                                ))}
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

                        <h2 className="text-2xl font-bold mb-6">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Senior Stylist"
                                    className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                                        value={formData.experience}
                                        onChange={e => setFormData({ ...formData, experience: parseInt(e.target.value) })}
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
                                <label className="block text-sm font-medium mb-1">Specialties (comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="Hair cut, Beard trim, Coloring"
                                    className="w-full p-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                                    value={formData.specialties}
                                    onChange={e => setFormData({ ...formData, specialties: e.target.value })}
                                />
                            </div>

                            <Button type="submit" className="w-full bg-primary text-white mt-4">
                                {editingStaff ? 'Update Staff Member' : 'Add Staff Member'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
