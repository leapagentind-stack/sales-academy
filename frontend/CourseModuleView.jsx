import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { PlayCircle, Lock, Unlock, CheckCircle, Clock } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/courses";
const COMPLETION_THRESHOLD = 75;

const CourseModuleView = () => {
  const { moduleId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchModuleCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE_URL);
      setCourses(res.data);
    } catch (error) {
      console.error(error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModuleCourses();
  }, [fetchModuleCourses]);

  const { avgCompletion, isAssignmentUnlocked } = useMemo(() => {
    if (courses.length === 0) return { avgCompletion: 0, isAssignmentUnlocked: false };
    const totalProgress = courses.reduce((sum, course) => sum + (course.userProgress || 0), 0);
    const calculatedAvgCompletion = totalProgress / courses.length;
    return {
      avgCompletion: Math.round(calculatedAvgCompletion),
      isAssignmentUnlocked: calculatedAvgCompletion >= COMPLETION_THRESHOLD,
    };
  }, [courses]);

  if (loading) return <div className="p-8 text-center text-xl text-indigo-600">Loading module content...</div>;
  if (courses.length === 0) return <div className="p-8 text-center text-xl text-gray-500">No courses found.</div>;

  const CourseCard = ({ course }) => {
    const progress = course.userProgress || 0;
    const isCompleted = progress === 100;
    const isStarted = progress > 0 && progress < 100;

    return (
      <Link to={`/watch/${course.id}`} className="block">
        <div className="flex items-center space-x-4 p-4 bg-white hover:bg-gray-50 transition duration-150 rounded-lg shadow-sm border border-gray-100">
          <div className="relative flex-shrink-0">
            <img 
              src={course.thumbnail_url || "https://via.placeholder.com/150"} 
              alt={course.title} 
              className="w-24 h-16 object-cover rounded-md"
            />
            <PlayCircle className="absolute inset-0 m-auto text-white/90 w-7 h-7" fill="currentColor"/>
          </div>
          <div className="flex-grow">
            <h4 className="text-base font-medium text-gray-800 line-clamp-2">{course.title}</h4>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              <span className="mr-4">Self-paced</span>
              {isCompleted && <CheckCircle className="w-4 h-4 text-green-500 mr-1" />}
              {isStarted && <span className="text-xs font-medium text-blue-600">({progress}% viewed)</span>}
              {progress === 0 && <span className="text-xs text-gray-400">Not started</span>}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-indigo-700 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold mb-1">Module Content</h1>
        <p className="text-indigo-200 text-lg">Course Progress: {avgCompletion}%</p>
        <div className="mt-4 pt-4 border-t border-indigo-600">
          <div className="w-full bg-indigo-200 rounded-full h-2.5">
            <div className="bg-green-400 h-2.5 rounded-full" style={{ width: `${avgCompletion}%` }}></div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Lessons ({courses.length})</h2>
        {courses.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>
      <div className={`p-6 rounded-xl shadow-xl transition duration-300 ${isAssignmentUnlocked ? 'bg-green-50 border-4 border-green-300' : 'bg-gray-100 border border-gray-300'}`}>
        <div className="flex items-center space-x-4">
          {isAssignmentUnlocked ? <Unlock className="w-8 h-8 text-green-600" /> : <Lock className="w-8 h-8 text-gray-500" />}
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900">Module Assignment</h3>
            <p className="text-sm text-gray-600">{isAssignmentUnlocked ? "Unlocked!" : "Locked - 75% Completion Required"}</p>
          </div>
          <button disabled={!isAssignmentUnlocked} className={`px-6 py-2 rounded-lg font-semibold ${isAssignmentUnlocked ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500'}`}>
            {isAssignmentUnlocked ? "Start" : "Locked"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseModuleView;