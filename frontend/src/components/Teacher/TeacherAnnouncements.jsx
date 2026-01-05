import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Calendar, Bell } from 'lucide-react';

const TeacherAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/announcements');
                setAnnouncements(res.data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        fetchUpdates();
    }, []);

    if (announcements.length === 0) return null;

    return (
        <div className="mt-10 mb-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <Megaphone className="text-blue-600" size={28} /> Admin Announcements
                </h2>
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full animate-bounce">
                    <Bell size={20} />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map((ann) => (
                    <div key={ann.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-blue-500 uppercase tracking-widest mb-3">
                            <Calendar size={14} /> {new Date(ann.created_at).toLocaleDateString()}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">{ann.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                            {ann.description}
                        </p>
                        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center text-xs text-gray-400">
                            Posted by Academy Admin
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherAnnouncements;