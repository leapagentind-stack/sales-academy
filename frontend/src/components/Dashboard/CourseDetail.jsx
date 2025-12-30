// frontend/src/components/Teacher/CourseDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
    Clock, Users, BarChart, FileText, CheckCircle, Video, BookOpen, User, List, 
    ArrowRight, Edit2, PlusCircle, Trash2, ChevronDown, ChevronUp 
} from 'lucide-react';

const API_COURSE_URL = "http://localhost:5000/api/courses";

// Mock Data for demonstration (Replace with actual API fetch)
const mockCourseData = {
    id: 'course_1',
    title: 'Advanced Sales Negotiation & Closing',
    description: 'Master the art of high-value negotiation, objection handling, and consistently closing deals. This course provides proprietary scripts and real-world case studies.',
    duration: '10 hours',
    students: 1250,
    averageRating: 4.7,
    instructorName: 'Naveen Kumar',
    instructorBio: 'Lead Sales Trainer with 15 years experience and founder of Pro Content Creator.',
    lastUpdated: 'Dec 12, 2025',
    requirements: [
        "Basic understanding of the sales cycle (B2B or B2C).",
        "Willingness to practice and implement new scripts.",
        "A desktop or laptop for optimal viewing."
    ],
    modules: [
        { id: 1, title: 'Module 1: Foundation of Negotiation', lessons: 5, totalDuration: '1:30' },
        { id: 2, title: 'Module 2: Advanced Objection Handling', lessons: 7, totalDuration: '2:15' },
        { id: 3, title: 'Module 3: Psychology of Closing', lessons: 4, totalDuration: '1:45' },
        { id: 4, title: 'Module 4: Case Studies & Role Play', lessons: 8, totalDuration: '3:00' },
    ],
    video_url: '/videos/Advanced_Sales.mp4' // Placeholder video URL
};

// --- Module Accordion Item ---
const ModuleItem = ({ module }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Mock lessons for the expanded view
    const mockLessons = Array.from({ length: module.lessons }, (_, i) => ({
        id: `L${i+1}`,
        title: `Lesson ${i+1}: Topic Title`,
        duration: '5:00',
        videoUrl: `/dashboard/video-edit/${module.id}/${i+1}` // Link to video editing/analytics
    }));

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-3 shadow-sm">
            <button 
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center text-lg font-semibold text-gray-800">
                    <BookOpen className="w-5 h-5 mr-3 text-indigo-600"/>
                    {module.title}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-4">{module.lessons} lessons ({module.totalDuration})</span>
                    {isOpen ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                </div>
            </button>

            {isOpen && (
                <div className="p-4 bg-white">
                    <h4 className="text-md font-bold mb-3 text-gray-700">Lessons:</h4>
                    {mockLessons.map(lesson => (
                        <div key={lesson.id} className="flex justify-between items-center py-2 border-b last:border-b-0 hover:bg-indigo-50/50 rounded-md px-2">
                            <div className="flex items-center">
                                <Video className="w-4 h-4 mr-3 text-red-500"/>
                                <span className="text-gray-700">{lesson.title}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">{lesson.duration}</span>
                                <Link to={lesson.videoUrl} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                                    Manage <ArrowRight className="w-4 h-4 ml-1"/>
                                </Link>
                                <button title="Delete Lesson"><Trash2 className="w-4 h-4 text-red-400 hover:text-red-600"/></button>
                            </div>
                        </div>
                    ))}
                    <button className="mt-4 flex items-center text-green-600 hover:text-green-700 text-sm font-semibold">
                        <PlusCircle className="w-4 h-4 mr-2"/> Add New Lesson
                    </button>
                </div>
            )}
        </div>
    );
};
// --- End Module Accordion Item ---


const CourseDetail = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Data Fetching (Use the mock data for now) ---
    useEffect(() => {
        // In a real application, you would fetch:
        // const res = await axios.get(`${API_COURSE_URL}/${courseId}/details`);
        setCourse(mockCourseData);
        setLoading(false);
    }, [courseId]);


    if (loading) {
        return <div className="p-10 text-center text-xl text-indigo-600">Loading course details...</div>;
    }
    if (!course) {
        return <div className="p-10 text-center text-xl text-red-600">Course not found.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            
            {/* --- TOP BANNER/HERO SECTION --- */}
            <div className="bg-indigo-700 text-white p-8 md:p-12 shadow-2xl">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-extrabold mb-3">{course.title}</h1>
                    <p className="text-indigo-200 text-xl mb-6">{course.description}</p>
                    
                    {/* Key Stats */}
                    <div className="flex flex-wrap gap-8 text-sm font-medium">
                        <span className="flex items-center">
                            <User className="w-5 h-5 mr-2 text-indigo-300"/> Instructor: {course.instructorName}
                        </span>
                        <span className="flex items-center">
                            <Users className="w-5 h-5 mr-2 text-indigo-300"/> Enrolled: {course.students.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-indigo-300"/> Last Update: {course.lastUpdated}
                        </span>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 flex gap-4">
                        <Link to="/dashboard/courses" className="px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg flex items-center">
                            <ArrowRight className="w-5 h-5 mr-2"/> Back to Course Grid
                        </Link>
                        <button className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition shadow-lg flex items-center">
                            <Edit2 className="w-5 h-5 mr-2"/> Edit Course Details
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT & SIDEBAR --- */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 p-6 md:p-10">
                
                {/* LEFT COLUMN: Course Content/Modules (80% of space) */}
                <div className="lg:col-span-2 space-y-10">
                    
                    {/* Course Content Section */}
                    <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-extrabold mb-6 text-gray-900 flex items-center">
                            <List className="w-6 h-6 mr-3 text-indigo-600"/> Course Content ({course.modules.length} Modules)
                        </h2>
                        <div className="space-y-4">
                            {course.modules.map(module => (
                                <ModuleItem key={module.id} module={module} />
                            ))}
                        </div>
                        <button className="mt-6 w-full py-3 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200 transition flex items-center justify-center">
                            <PlusCircle className="w-5 h-5 mr-2"/> Add New Module
                        </button>
                    </section>

                    {/* Requirements Section */}
                    <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-extrabold mb-4 text-gray-900 flex items-center">
                            <FileText className="w-6 h-6 mr-3 text-indigo-600"/> Requirements
                        </h2>
                        <ul className="space-y-3 list-none pl-0">
                            {course.requirements.map((req, index) => (
                                <li key={index} className="flex items-start text-gray-700">
                                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 text-green-500 mt-1"/>
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
                
                {/* RIGHT COLUMN: Instructor/Analytics Sidebar (20% of space) */}
                <div className="lg:col-span-1 space-y-10">
                    
                    {/* Instructor Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-xl font-bold mb-3 text-gray-800 flex items-center">
                            <User className="w-5 h-5 mr-2 text-indigo-600"/> Instructor: {course.instructorName}
                        </h3>
                        <p className="text-sm text-gray-600 border-t pt-3">
                            {course.instructorBio}
                        </p>
                        {/* Link to Edit Profile */}
                        <button className="mt-4 w-full py-2 bg-gray-100 text-indigo-600 rounded-lg font-semibold hover:bg-gray-200 transition">
                            Edit Profile
                        </button>
                    </div>

                    {/* Quick Analytics Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                            <BarChart className="w-5 h-5 mr-2 text-red-600"/> Quick Analytics
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Total Views:</span>
                                <span className="font-semibold text-gray-800">145.2K</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Completion Rate:</span>
                                <span className="font-semibold text-green-600">68%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Average Rating:</span>
                                <span className="font-semibold text-yellow-600">{course.averageRating} ★</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;