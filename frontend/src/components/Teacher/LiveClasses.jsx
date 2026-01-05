import React, { useState, useEffect } from 'react';
import { 
    Video, Calendar, Clock, Plus, Trash2, 
    ExternalLink, X, Loader2, User, Link, Timer 
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/live-classes';

const LiveClasses = () => {
    const [classes, setClasses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        instructor: 'Naveen',
        date: '',
        time: '',
        duration: '60',
        link: ''
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setClasses(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSchedule = async () => {
        if (!formData.title || !formData.date || !formData.time) return alert("Please fill required fields");
        
        setIsSaving(true);
        try {
            const res = await fetch(`${API_URL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (res.ok) {
                const newClass = await res.json();
                setClasses([...classes, newClass]);
                setIsModalOpen(false);
                setFormData({ title: '', instructor: 'Naveen', date: '', time: '', duration: '60', link: '' });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this scheduled class?")) return;
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            setClasses(classes.filter(c => c.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-8 h-full bg-gray-50 overflow-y-auto font-sans">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Video size={28} className="text-blue-600" />
                        </div>
                        Live Classes
                    </h1>
                    <p className="text-slate-500 mt-2 text-base">Schedule and manage your upcoming live sessions.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus size={20} /> Schedule Class
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {classes.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-16 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                            <div className="p-4 bg-gray-50 rounded-full mb-4">
                                <Calendar size={48} className="opacity-50" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600">No live classes scheduled</h3>
                            <p className="text-sm mt-2">Click the button above to create your first session.</p>
                        </div>
                    ) : (
                        classes.map((cls) => (
                            <div key={cls.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-xl p-3 min-w-[70px] border border-blue-100">
                                        <span className="text-2xl font-bold leading-none">{new Date(cls.date).getDate()}</span>
                                        <span className="text-xs font-bold uppercase tracking-wider mt-1">{new Date(cls.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(cls.id)} 
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                    {cls.title}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-6">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                        <User size={14} />
                                    </div>
                                    {cls.instructor}
                                </div>

                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-blue-500" /> 
                                            <span className="font-semibold">{cls.time}</span>
                                        </div>
                                        <div className="w-px h-4 bg-slate-300"></div>
                                        <div className="flex items-center gap-2">
                                            <Timer size={16} className="text-orange-500" /> 
                                            <span>{cls.duration} min</span>
                                        </div>
                                    </div>

                                    <a 
                                        href={cls.meeting_link} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex justify-center items-center gap-2 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
                                    >
                                        Join Meeting <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-xl font-bold text-slate-900">Schedule New Class</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Topic / Title</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={formData.title} 
                                        onChange={e => setFormData({...formData, title: e.target.value})} 
                                        placeholder="e.g. Advanced Sales Negotiation" 
                                        className="w-full pl-4 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-slate-800 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Date</label>
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none">
                                            <Calendar size={18} />
                                        </div>
                                        <input 
                                            type="date" 
                                            value={formData.date} 
                                            onChange={e => setFormData({...formData, date: e.target.value})} 
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Time</label>
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none">
                                            <Clock size={18} />
                                        </div>
                                        <input 
                                            type="time" 
                                            value={formData.time} 
                                            onChange={e => setFormData({...formData, time: e.target.value})} 
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Duration (min)</label>
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none">
                                            <Timer size={18} />
                                        </div>
                                        <input 
                                            type="number" 
                                            value={formData.duration} 
                                            onChange={e => setFormData({...formData, duration: e.target.value})} 
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Instructor</label>
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none">
                                            <User size={18} />
                                        </div>
                                        <input 
                                            type="text" 
                                            value={formData.instructor} 
                                            onChange={e => setFormData({...formData, instructor: e.target.value})} 
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Meeting Link</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none">
                                        <Link size={18} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={formData.link} 
                                        onChange={e => setFormData({...formData, link: e.target.value})} 
                                        placeholder="https://zoom.us/j/..." 
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-blue-600 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium" 
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleSchedule} 
                                disabled={isSaving} 
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={24} /> : 'Schedule Class'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveClasses;