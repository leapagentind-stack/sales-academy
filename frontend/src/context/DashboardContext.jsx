import React, { createContext, useState, useEffect, useContext } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  // 1. STATE
  const [courses, setCourses] = useState([]); // Start empty, fetch from DB
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 2. FETCH DATA FROM BACKEND
  const fetchCourses = async () => {
    try {
      // Assuming your backend is running on port 5000
      const response = await fetch('http://localhost:5000/api/courses');
      const data = await response.json();
      
      // The DB has 'title' and 'category', but the UI needs 'progress' and 'icons'.
      // We map the DB data to include these UI defaults so the Dashboard looks good.
      const formattedData = data.map((course, index) => ({
        ...course,
        // Keep ID from DB
        id: course.id, 
        // Default UI properties (since they aren't in the DB yet)
        progress: Math.floor(Math.random() * 100), // Random progress for demo
        iconType: index === 0 ? 'text' : 'icon', // First one gets text icon
        iconValue: index === 0 ? '$' : 'fa-solid fa-book' // Default icon
      }));

      setCourses(formattedData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. LOAD ON MOUNT
  useEffect(() => {
    fetchCourses();
  }, []);

  // 4. ACTIONS
  // We update this to call the API, then re-fetch
  const addCourse = async (courseData) => {
    // For the dashboard quick-add (optional), usually you'd redirect to the create page.
    // If you want to refresh the count manually:
    await fetchCourses(); 
  };

  const deleteCourse = async (id) => {
    try {
      // Call Backend to delete
      await fetch(`http://localhost:5000/api/courses/${id}`, { method: 'DELETE' });
      // Update State locally to reflect change immediately
      setCourses(courses.filter(course => course.id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const addStudent = (studentName, studentEmail) => {
    const newStudent = { id: Date.now(), name: studentName, email: studentEmail };
    setStudents([...students, newStudent]);
  };

  return (
    <DashboardContext.Provider value={{ 
      courses, 
      students, 
      addCourse, 
      deleteCourse, 
      addStudent, 
      searchQuery, 
      setSearchQuery,
      loading,
      fetchCourses // Exporting this so other pages can trigger a refresh
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);