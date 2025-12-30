// frontend/src/components/Learner/CourseModuleView.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { PlayCircle, Lock, Unlock, CheckCircle, Clock, BookOpen } from "lucide-react";

// NOTE: In the backend server.js, we are using 'level' (e.g., Beginner) as the moduleId.
const API_BASE_URL = "http://localhost:5000/api/learner/module";
const COMPLETION_THRESHOLD = 75;

const CourseModuleView = () => {
  const { moduleId } = useParams(); // e.g., 'Beginner'
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Data Logic ---
  const fetchModuleCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/${moduleId}`);
      setCourses(res.data);
    } catch (error) {
      console.error("Error loading module courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    fetchModuleCourses();
  }, [fetchModuleCourses]);


  // --- Progress Calculation Logic ---
  const { avgCompletion, isAssignmentUnlocked } = useMemo(() => {
    if (courses.length === 0) {
      return { avgCompletion: 0, isAssignmentUnlocked: false };
    }

    const totalProgress = courses.reduce((sum, course) => sum + course.userProgress, 0);
    const calculatedAvgCompletion = totalProgress / courses.length;

    return {
      avgCompletion: Math.round(calculatedAvgCompletion),
      isAssignmentUnlocked: calculatedAvgCompletion >= COMPLETION_THRESHOLD,
    };
  }, [courses]);
  // --- End Progress Logic ---

  if (loading) {
    return <div className="p-8 text-center text-xl text-indigo-600">Loading {moduleId} content...</div>;
  }
  
  // --- Helper Component for Course Card ---
  const CourseCard = ({ course }) => {
    const isCompleted = course.userProgress === 100;
    const isStarted = course.userProgress > 0 && course.userProgress < 100;

    return (
      <Link to={`/watch/${course.id}`} className="block">
        <div className="flex items-center space-x-4 p-4 bg-white hover:bg-gray-50 transition duration-150 rounded-lg shadow-sm border border-gray-100">
          
          {/* Thumbnail/Play Icon */}
          <div className="relative flex-shrink-0">
            {/* The secureUrl (or video_url) contains the video location */}
            <div className="w-24 h-16 bg-black rounded-md flex items-center justify-center">
                <PlayCircle className="text-white/90 w-7 h-7" fill="currentColor"/>
            </div>
          </div>

          {/* Info */}
          <div className="flex-grow">
            <h4 className="text-base font-medium text-gray-800 line-clamp-2">{course.title}</h4>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              <span className="mr-4">{course.duration || 'N/A'}</span>
              
              {isCompleted && <CheckCircle className="w-4 h-4 text-green-500 mr-1" />}
              {isStarted && <span className="text-xs font-medium text-blue-600">({course.userProgress}% viewed)</span>}
              {course.userProgress === 0 && <span className="text-xs text-gray-400">Not started</span>}
            </div>
          </div>
        </div>
      </Link>
    );
  };
  // --- End Helper Component ---

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      
      {/* Module Header & Progress */}
      <div className="bg-indigo-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold mb-1">{moduleId} Course Module</h1>
        <p className="text-indigo-200 text-lg">You must complete **{COMPLETION_THRESHOLD}%** to move forward.</p>
        
        <div className="mt-4 pt-4 border-t border-indigo-600">
          <p className="text-sm font-semibold mb-1">Module Progress: {avgCompletion}%</p>
          <div className="w-full bg-indigo-200 rounded-full h-2.5">
            <div 
              className="bg-green-400 h-2.5 rounded-full" 
              style={{ width: `${avgCompletion}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Courses List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Lesson List ({courses.length})</h2>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      {/* Assignment Section (The core unlock logic) */}
      <div className={`p-6 rounded-xl shadow-xl transition duration-300 ${isAssignmentUnlocked ? 'bg-green-50 border-4 border-green-300' : 'bg-gray-100 border border-gray-300'}`}>
        <div className="flex items-center space-x-4">
          
          {isAssignmentUnlocked ? (
            <Unlock className="w-8 h-8 text-green-600 flex-shrink-0" />
          ) : (
            <Lock className="w-8 h-8 text-gray-500 flex-shrink-0" />
          )}

          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900">{moduleId} Module Final Assignment</h3>
            <p className="text-sm text-gray-600 mt-1">
              {isAssignmentUnlocked 
                ? "Unlocked! Click below to access your final quiz and submission area."
                : `Locked. Need ${COMPLETION_THRESHOLD}% average progress to unlock.`}
            </p>
          </div>

          <Link
            to={isAssignmentUnlocked ? `/assignments/start/${moduleId}` : '#'}
            className={`px-6 py-2 rounded-lg font-semibold transition flex items-center ${isAssignmentUnlocked 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {isAssignmentUnlocked ? <BookOpen className="w-4 h-4 mr-2"/> : <Lock className="w-4 h-4 mr-2"/>}
            {isAssignmentUnlocked ? "Start Assignment" : "Locked"}
          </Link>
        </div>
      </div>
      
    </div>
  );
};

export default CourseModuleView;