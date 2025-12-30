import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, BookOpen } from "lucide-react";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const deleteCourse = async (id) => {
    if(!window.confirm("Are you sure you want to delete this course permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Manage Courses</h2>
        <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition">
          <Plus size={18} className="inline-block mr-1" /> Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {courses.length === 0 ? (
          <div className="col-span-full text-center bg-white shadow rounded-lg py-10 text-gray-600">
            <p className="text-lg font-semibold">No courses found in database</p>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col justify-between">
              <div>
                <div className="h-32 w-full bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  {course.thumbnail_url ? <img src={course.thumbnail_url} className="w-full h-full object-cover" alt={course.title} /> : <BookOpen className="text-gray-400" size={32} />}
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{course.title}</h3>
                  <p className="text-[10px] text-gray-500 truncate">{course.instructor}</p>
                  <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md mt-1 inline-block">{course.category}</span>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-gray-600">
                    <p className="font-bold text-emerald-600">₹{course.price}</p>
                    <p>{course.lessons?.length || 0} Lessons</p>
                  </div>
                </div>
              </div>
              <button onClick={() => deleteCourse(course.id)} className="mt-3 bg-red-500 text-white w-full py-1.5 rounded-lg hover:bg-red-600 flex justify-center transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageCourses;