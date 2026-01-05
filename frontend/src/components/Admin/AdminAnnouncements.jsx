import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Megaphone, Trash2, PlusCircle, Clock } from 'lucide-react';

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '' });

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/announcements');
            setAnnouncements(res.data);
        } catch (err) {
            console.error("Error fetching announcements:", err);
        }
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) return toast.error("Please fill title and description");
        try {
            // We send 'description' to match your DB column
            await axios.post('http://localhost:5000/api/announcements', {
                title: formData.title,
                description: formData.description,
                images: [] // You can add image upload logic later if needed
            });
            toast.success("Announcement Posted Successfully!");
            setFormData({ title: '', description: '' });
            fetchAnnouncements();
        } catch (err) {
            toast.error("Error posting announcement");
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Delete this announcement?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/announcements/${id}`);
            toast.info("Announcement Deleted");
            fetchAnnouncements();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <Megaphone className="text-blue-600" /> Admin Announcement Panel
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <PlusCircle size={18} className="text-blue-500" /> Create New Update
                </h2>
                <form onSubmit={handlePost} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Announcement Title"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Announcement Description..."
                        rows="4"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <button className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                        Publish Announcement
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-700">Live Updates</h2>
                {announcements.map((item) => (
                    <div key={item.id} className="bg-white p-5 rounded-xl border flex justify-between items-start shadow-sm">
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                            <p className="text-gray-600 mt-2 text-sm leading-relaxed">{item.description}</p>
                            <div className="flex items-center gap-2 mt-4 text-[11px] text-gray-400 font-medium">
                                <Clock size={12} /> {new Date(item.created_at).toLocaleString()}
                            </div>
                        </div>
                        <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-all">
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminAnnouncements;