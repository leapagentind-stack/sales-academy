import React, { useState } from 'react';
import { Video, Plus, X, Upload, Check, Trash2, Play } from 'lucide-react';

export default function TeacherDashboard() {
  const [currentPage, setCurrentPage] = useState('manage');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    video: null,
    content: '',
    requirements: '',
    description: '',
    reviews: '',
    instructor: ''
  });
  const [activeTab, setActiveTab] = useState('content');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, video: file });
    }
  };

  const handleSaveUpload = () => {
    if (!formData.title || !formData.video) {
      alert('Please enter course title and upload video');
      return;
    }

    const newCourse = {
      id: Date.now(),
      title: formData.title,
      video: URL.createObjectURL(formData.video),
      videoName: formData.video.name,
      size: (formData.video.size / (1024 * 1024)).toFixed(2) + ' MB',
      date: new Date().toISOString().split('T')[0],
      content: formData.content,
      requirements: formData.requirements,
      description: formData.description,
      reviews: formData.reviews,
      instructor: formData.instructor,
      thumbnail: URL.createObjectURL(formData.video)
    };

    setCourses([...courses, newCourse]);
    setFormData({
      title: '',
      video: null,
      content: '',
      requirements: '',
      description: '',
      reviews: '',
      instructor: ''
    });
    setCurrentPage('manage');
  };

  const handleDelete = (id) => {
    setCourses(courses.filter(course => course.id !== id));
    if (selectedCourse?.id === id) {
      setSelectedCourse(null);
    }
  };

  const renderManagePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Manage Courses
            </h1>
          </div>
          <button
            onClick={() => setCurrentPage('add')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Course
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <Video className="w-16 h-16 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No courses yet</h2>
            <p className="text-gray-500 mb-6">Click "Add Course" to create your first course</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(course.id);
                      }}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{course.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {course.size}
                    </span>
                    <span>{course.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-2xl font-bold text-gray-800">{selectedCourse.title}</h2>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Video Player */}
              <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                <video
                  src={selectedCourse.video}
                  controls
                  className="w-full h-auto bg-black"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Course Information Tabs */}
              <div className="space-y-6">
                {selectedCourse.content && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Course Content
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedCourse.content}</p>
                  </div>
                )}

                {selectedCourse.requirements && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Requirements
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedCourse.requirements}</p>
                  </div>
                )}

                {selectedCourse.description && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      Description
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedCourse.description}</p>
                  </div>
                )}

                {selectedCourse.reviews && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                    <h3 className="text-lg font-bold text-orange-900 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      Reviews
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedCourse.reviews}</p>
                  </div>
                )}

                {selectedCourse.instructor && (
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200">
                    <h3 className="text-lg font-bold text-pink-900 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                      Instructor
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedCourse.instructor}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAddPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Add Course
            </h1>
          </div>
          <p className="text-gray-600 mt-2">Upload a video and write all course information for students</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Course Title */}
          <div className="p-6 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter course title..."
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-lg"
            />
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto">
              {['content', 'requirements', 'description', 'reviews', 'instructor'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold text-sm capitalize whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'text-indigo-600 border-b-3 border-indigo-600 bg-white'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <textarea
              value={formData[activeTab]}
              onChange={(e) => setFormData({ ...formData, [activeTab]: e.target.value })}
              placeholder={`Write ${activeTab} here...`}
              rows="8"
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none text-base"
            />
          </div>

          {/* Video Upload Section */}
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-800">Upload Course Video</h3>
            </div>
            
            <div className="bg-white rounded-2xl border-2 border-dashed border-indigo-300 p-8 text-center hover:border-indigo-500 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Video className="w-10 h-10 text-indigo-600" />
                </div>
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  {formData.video ? formData.video.name : 'Click to upload video'}
                </p>
                <p className="text-sm text-gray-500">MP4, MOV, AVI, MKV (Max 500MB)</p>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-4">
            <button
              onClick={() => setCurrentPage('manage')}
              className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveUpload}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Save & Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return currentPage === 'manage' ? renderManagePage() : renderAddPage();
}