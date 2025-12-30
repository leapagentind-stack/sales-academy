import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Video } from 'lucide-react';

// --- Mock Data (Replace this with actual API calls later) ---
const mockCourses = [
    { id: 'c1', title: '100 Days of Code: The Complete Python Pro Bootcamp', instructor: 'Dr. Angela Yu', rating: 4.7, students: '401,986', price: 519, tag: 'Bestseller' },
    { id: 'c2', title: 'AI Engineer Agent & MCP Course', instructor: 'Ed Bonner', rating: 4.7, students: '23,539', price: 519, tag: 'Premium' },
    { id: 'c3', title: 'The Complete Full-Stack Web Development Bootcamp', instructor: 'Stephanie Maeik', rating: 4.7, students: '491,284', price: 559, tag: 'Bestseller' },
    { id: 'c4', title: 'Ultimate AWS Certified Solutions Architect Associate', instructor: 'Stephan Maeik', rating: 4.7, students: '27,938', price: 559, tag: 'Premium' },
];
// --- End Mock Data ---

// --- Helper Component: Learner Course Card ---
const LearnerCourseCard = ({ course }) => {
    return (
        <Link to={`/learn/module/${course.id}`} className="learner-card hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.01] bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
            {/* Thumbnail Placeholder */}
            <div className="bg-purple-600 h-32 flex items-center justify-center text-white font-bold text-2xl relative">
                <Video className="w-10 h-10 opacity-75" />
                {/* Tag */}
                <div className="absolute top-2 left-2 px-3 py-1 text-xs font-bold rounded-full text-white" style={{ backgroundColor: course.tag === 'Bestseller' ? '#f0b800' : '#8b5cf6' }}>
                    {course.tag}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-base font-bold text-gray-900 line-clamp-2 h-10 mb-1" title={course.title}>
                    {course.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{course.instructor}</p>
                
                <div className="flex items-center text-sm text-gray-700 font-semibold my-2">
                    <span className="text-yellow-500 mr-1">★</span> 
                    {course.rating} ({course.students})
                </div>
                
                <div className="text-lg font-extrabold text-gray-900 mt-2">
                    ₹{course.price}
                </div>
            </div>
        </Link>
    );
};
// --- End Helper Component: Learner Course Card ---


const LearnerHome = () => {
    const [trendingCourses, setTrendingCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);

    useEffect(() => {
        // In a real app, you would fetch data here:
        // axios.get('/api/learner/dashboard').then(res => setMyCourses(res.data.myCourses));
        
        // Mocking data for now:
        setMyCourses(mockCourses.slice(0, 1)); // Show one course as 'In Progress'
        setTrendingCourses(mockCourses);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <header className="max-w-7xl mx-auto mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-extrabold text-gray-900">Let's start learning</h1>
                    <Link to="/my-learning" className="text-purple-600 font-semibold hover:text-purple-800 transition">
                        My learning
                    </Link>
                </div>

                {/* --- My Learning Section --- */}
                <div className="my-learning-section bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                        <BookOpen className="w-6 h-6 mr-2 text-purple-600" /> What I'm currently learning
                    </h2>
                    
                    {myCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {myCourses.map(course => (
                                <LearnerCourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">You are not currently enrolled in any courses. Explore the trending courses below!</p>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                {/* --- Trending Courses Section --- */}
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-purple-600" /> What to learn next
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {trendingCourses.map(course => (
                        <LearnerCourseCard key={course.id} course={course} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default LearnerHome;