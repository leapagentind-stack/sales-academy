import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ThumbsUp, Share2, MessageSquare, User, Lock, Play, ChevronLeft } from 'lucide-react';

const VideoPlayer = () => {
    const { id } = useParams();
    const videoRef = useRef(null);
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/courses");
                const found = res.data.find(c => String(c.id) === String(id));
                if (found) {
                    setCourse(found);
                    if (found.modules?.length > 0 && found.modules[0].videos?.length > 0) {
                        setActiveLesson(found.modules[0].videos[0]);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading || !course) return <div className="p-10 text-center">Loading Course...</div>;

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8fafc]">
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b flex items-center gap-4 bg-white">
                    <Link to="/dashboard/courses" className="text-gray-500 hover:text-black"><ChevronLeft /></Link>
                    <h1 className="font-bold text-lg">{course.title}</h1>
                </div>

                <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-6">
                        {activeLesson ? (
                            <video 
                                key={activeLesson.video_url} 
                                src={activeLesson.video_url} 
                                controls autoPlay className="w-full h-full" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white italic">No video found.</div>
                        )}
                    </div>

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{activeLesson?.title}</h2>
                            <p className="text-sm text-gray-500 mt-1">Instructor: {course.instructor}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold hover:bg-blue-100 transition"><ThumbsUp size={18} /> Like</button>
                            <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition"><Share2 size={18} /> Share</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-80 bg-white border-l p-6 overflow-y-auto h-screen">
                <h3 className="font-bold text-gray-900 mb-6">Course Content</h3>
                {course.modules.map((module, mIdx) => (
                    <div key={mIdx} className="mb-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{module.title}</p>
                        <div className="space-y-2">
                            {module.videos.map((video, vIdx) => (
                                <button 
                                    key={video.id} 
                                    onClick={() => setActiveLesson(video)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left ${activeLesson?.id === video.id ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'hover:bg-gray-50 text-gray-600'}`}
                                >
                                    <Play size={16} className={activeLesson?.id === video.id ? 'text-blue-600' : 'text-gray-400'} />
                                    <span className="text-sm font-medium">{vIdx + 1}. {video.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoPlayer;