// frontend/src/components/Learner/VideoPlayer.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Clock, Loader2, PlayCircle, CheckCircle, Video, TrendingUp } from 'lucide-react';

const API_PROGRESS_URL = "http://localhost:5000/api/learner/progress";
// This URL will be used to fetch all lessons in the module
const API_MODULE_COURSES_URL = "http://localhost:5000/api/learner/module"; 

// Mock Data for related courses (Replace with actual data fetch later)
const mockModuleCourses = [
    { id: 'course_1', title: 'Introduction to Sales Process', duration: '5:30', level: 'Beginner', userProgress: 100 },
    { id: 'course_2', title: 'Identifying Target Customers (Current Lesson)', duration: '8:45', level: 'Beginner', userProgress: 75 },
    { id: 'course_3', title: 'Qualification & Need Assessment', duration: '12:00', level: 'Beginner', userProgress: 0 },
    { id: 'course_4', title: 'The Art of Pitching', duration: '9:15', level: 'Beginner', userProgress: 0 },
    { id: 'course_5', title: 'Handling Objections', duration: '7:00', level: 'Beginner', userProgress: 0 },
    { id: 'course_6', title: 'Closing the Deal', duration: '15:30', level: 'Beginner', userProgress: 0 },
];

// --- Helper Component for the "Up Next" Sidebar ---
const RelatedCourseItem = ({ course, isCurrent }) => {
    const Icon = course.userProgress === 100 ? CheckCircle : isCurrent ? PlayCircle : Video;
    const color = course.userProgress === 100 ? 'text-green-500' : isCurrent ? 'text-red-500' : 'text-gray-500';

    return (
        <Link 
            to={`/watch/${course.id}`} 
            className={`flex items-start gap-3 p-3 rounded-lg transition-all ${isCurrent ? 'bg-gray-100 ring-2 ring-red-300' : 'hover:bg-gray-50'}`}
        >
            {/* Video Thumbnail/Icon Area (Left Side) */}
            <div className={`flex-shrink-0 w-24 h-14 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center relative`}>
                {/* You would embed a small thumbnail image here */}
                <Icon className={`w-6 h-6 ${color}`} />
                <span className="absolute bottom-1 right-1 text-xs text-white bg-black/70 px-1 rounded">{course.duration}</span>
            </div>
            
            {/* Title and Progress (Right Side) */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold line-clamp-2 ${isCurrent ? 'text-red-700' : 'text-gray-800'}`}>
                    {course.title} {isCurrent && '(Now Playing)'}
                </p>
                <div className="text-xs text-gray-500 mt-1">
                    {course.userProgress > 0 && course.userProgress < 100 && (
                        <p className="flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1"/> Progress: {course.userProgress}%
                        </p>
                    )}
                    {course.userProgress === 100 && (
                        <p className="flex items-center text-green-600 font-medium">
                            <CheckCircle className="w-3 h-3 mr-1"/> Completed
                        </p>
                    )}
                    {course.userProgress === 0 && (
                        <p>Not Started</p>
                    )}
                </div>
            </div>
        </Link>
    );
};
// --- End Related Course Item ---


const VideoPlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [course, setCourse] = useState(null);
  const [allCourses, setAllCourses] = useState([]); // State for all lessons in the module
  const [loading, setLoading] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);

  // --- 1. Fetch Course Data and Module Playlist ---
  useEffect(() => {
    const fetchModuleDetails = async () => {
      setLoading(true);
      // NOTE: We are assuming all lessons belong to the 'Beginner' module for now.
      // In a real app, you would fetch the module ID dynamically.
      const moduleId = 'Beginner'; 
      try {
        // Fetch all courses in the module
        const res = await axios.get(`${API_MODULE_COURSES_URL}/${moduleId}`); 
        const coursesList = res.data || [];
        setAllCourses(coursesList); // Store the full list for the sidebar
        
        const currentCourse = coursesList.find(c => c.id === courseId);
        
        if (currentCourse) {
          setCourse(currentCourse);
          setCurrentProgress(currentCourse.userProgress || 0);
          // Auto-seek the video to the last saved progress point if > 0
          if (videoRef.current && currentCourse.userProgress > 0) {
              videoRef.current.currentTime = (currentCourse.userProgress / 100) * videoRef.current.duration;
          }
        } else {
          alert("Course not found.");
          navigate('/learn/module/Beginner'); 
        }
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModuleDetails();
  }, [courseId, navigate]);


  // --- 2. Progress Update Handler (Server Interaction) ---
  const updateProgress = useCallback(async (percentage) => {
    try {
      await axios.post(API_PROGRESS_URL, {
        courseId: courseId,
        percentage: percentage,
      });
      console.log(`Progress saved: ${percentage}%`);
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  }, [courseId]);


  // --- 3. Video Event Handlers (The core logic for completion) ---
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const duration = video.duration;

    if (isNaN(duration)) return;

    // Calculate percentage and floor to the nearest 5% milestone
    const rawPercentage = (currentTime / duration) * 100;
    const percentage = Math.floor(rawPercentage / 5) * 5; 
    
    // Only update if the progress is a new, higher milestone
    if (percentage > currentProgress && percentage <= 100) {
        setCurrentProgress(percentage); // Update local state immediately
        updateProgress(percentage); // Send update to backend
    }
  }, [currentProgress, updateProgress]);

  const handleEnded = useCallback(() => {
    // Final check for 100% and find the next course
    if (currentProgress < 100) {
        updateProgress(100); 
    }

    const currentIndex = allCourses.findIndex(c => c.id === courseId);
    const nextCourse = allCourses[currentIndex + 1];

    if (nextCourse) {
        alert("Lesson completed! Starting the next lesson.");
        navigate(`/watch/${nextCourse.id}`); // Auto-navigate to the next video
    } else {
        alert("Module completed! Returning to module view.");
        navigate('/learn/module/Beginner'); 
    }

  }, [currentProgress, updateProgress, navigate, allCourses, courseId]);
  
  // --- Attach/Detach Listeners ---
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        video.addEventListener('loadedmetadata', () => {
            // After metadata loads, set the start time if progress > 0
            if (currentProgress > 0) {
                video.currentTime = (currentProgress / 100) * video.duration;
            }
        });
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);
        
        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);
            // Cleanup the metadata listener if necessary (though usually less critical)
        };
    }
  }, [handleTimeUpdate, handleEnded, currentProgress]); 
  // --- End Video Event Handlers ---


  if (loading || !course) {
    return <div className="p-8 text-center text-xl text-indigo-600 flex items-center justify-center"><Loader2 className="animate-spin w-5 h-5 mr-3"/> Loading content...</div>;
  }

  const videoSourceUrl = `http://localhost:5000${course.video_url}`; 

  // Filter the courses for the "Up Next" sidebar: exclude the current one
  const upNextCourses = allCourses.filter(c => c.id !== courseId);


  return (
    <div className="max-w-screen-xl mx-auto p-4 lg:p-6 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDE: Main Video Player & Details */}
        <div className="lg:w-3/4 space-y-6">

          {/* Video Player (YouTube style container) */}
          <div className="w-full aspect-video bg-black rounded-xl shadow-2xl overflow-hidden">
            <video 
              ref={videoRef}
              key={videoSourceUrl} 
              src={videoSourceUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
              poster={course.thumbnailUrl} // Add a thumbnail image here if available
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Title and Info */}
          <h1 className="text-3xl font-extrabold text-gray-900">{course.title}</h1>
          
          {/* Metadata Row */}
          <div className="flex items-center space-x-6 text-sm text-gray-500 border-b pb-3">
              <span className="text-indigo-600 font-semibold flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> {course.level} Module</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {course.duration || 'N/A'}</span>
          </div>

          {/* Course Description (Placeholder) */}
           <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-2 text-gray-800">About this Lesson</h2>
                <p className="text-gray-700">
                    This lesson is designed to teach you the fundamentals of customer identification and needs assessment. Pay close attention to the examples provided in the video.
                </p>
           </div>
        </div>
        
        {/* RIGHT SIDE: Up Next / Related Courses Playlist */}
        <div className="lg:w-1/4 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                <PlayCircle className="inline w-6 h-6 mr-2 text-red-600"/> Up Next in Module
            </h2>
            <div className="space-y-3">
                {allCourses.map((c, index) => (
                    <RelatedCourseItem 
                        key={c.id} 
                        course={{...c, index: index + 1}} 
                        isCurrent={c.id === courseId} 
                    />
                ))}
            </div>
            {/* Link back to the main module view */}
          <Link 
            to="/learn/module/Beginner" 
            className="block w-full p-3 text-center rounded-lg bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition mt-4"
          >
            View All Lessons
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;