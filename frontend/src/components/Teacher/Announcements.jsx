import React, { useState, useEffect } from 'react';
import { 
  Bell, Upload, X, ChevronLeft, ChevronRight, Trash2, Image as ImageIcon, Loader2 
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

// --- HELPER COMPONENT: IMAGE CAROUSEL (Kept exactly the same) ---
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mt-3 group">
      <img 
        src={images[currentIndex]} 
        alt={`Slide ${currentIndex}`} 
        className="w-full h-full object-cover transition-transform duration-500"
      />
      {images.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
const Announcements = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState([]); 
  const [previewUrls, setPreviewUrls] = useState([]); 
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false); // To show spinner during upload

  // ✅ 1. FETCH DATA FROM BACKEND ON LOAD
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/announcements');
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
    }
  };

  // 2. Handle Image Selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + selectedImages.length > 5) {
        toast.warning("You can only upload up to 5 images.");
        return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  // 3. Remove an image from preview
  const removeImage = (index) => {
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // ✅ 4. POST ANNOUNCEMENT TO BACKEND
  const handlePost = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
        toast.warning("Please add a title and description.");
        return;
    }

    try {
        setLoading(true); // Start loading spinner

        // Create FormData to send files
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        
        // Append all images
        selectedImages.forEach((file) => {
            formData.append('images', file);
        });

        // Send to Server
        const res = await axios.post('http://localhost:5000/api/announcements', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Update UI with new post from server
        const newPost = {
            ...res.data.data,
            instructor: "Admin", // Or get from user context
            time: "Just now"
        };
        
        setAnnouncements([newPost, ...announcements]);
        
        // Reset Form
        setTitle('');
        setDescription('');
        setSelectedImages([]);
        setPreviewUrls([]);
        toast.success("Announcement Posted Successfully!");

    } catch (error) {
        console.error(error);
        toast.error("Failed to post announcement.");
    } finally {
        setLoading(false); // Stop loading spinner
    }
  };

  // ✅ 5. DELETE FROM BACKEND
  const handleDelete = async (id) => {
      if(!window.confirm("Are you sure you want to delete this announcement?")) return;

      try {
          await axios.delete(`http://localhost:5000/api/announcements/${id}`);
          setAnnouncements(prev => prev.filter(item => item.id !== id));
          toast.success("Deleted successfully.");
      } catch (error) {
          console.error(error);
          toast.error("Failed to delete.");
      }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      
      {/* --- LEFT SIDE: CREATE ANNOUNCEMENT FORM --- */}
      <div className="lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Upload className="text-blue-600" /> Create Announcement
        </h2>

        <form onSubmit={handlePost} className="space-y-4">
            {/* Title */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="e.g. Holiday Schedule"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                    rows="4"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                    placeholder="Write your update here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                ></textarea>
            </div>

            {/* Image Upload Area */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Add Photos (Max 5)</label>
                
                {/* Upload Box */}
                <div className="relative border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg p-6 text-center hover:bg-slate-100 transition cursor-pointer">
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={loading}
                    />
                    <div className="flex flex-col items-center justify-center text-slate-500">
                        <ImageIcon size={32} className="mb-2 text-blue-400"/>
                        <p className="text-sm font-medium">Click to upload photos</p>
                        <p className="text-xs text-slate-400">JPG, PNG supported</p>
                    </div>
                </div>

                {/* Preview Grid */}
                {previewUrls.length > 0 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                        {previewUrls.map((url, idx) => (
                            <div key={idx} className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border border-slate-200 group">
                                <img src={url} alt="preview" className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                       <Loader2 className="animate-spin" size={20} /> Posting...
                    </>
                ) : (
                    "Post Announcement"
                )}
            </button>
        </form>
      </div>

      {/* --- RIGHT SIDE: ANNOUNCEMENTS FEED (SCROLLABLE) --- */}
      <div className="lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Bell className="text-blue-600" /> Recent Updates
        </h2>

        <div className="space-y-6">
            {announcements.map((item) => (
                <div key={item.id} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
                    
                    {/* Header: Avatar & Info */}
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
                                {item.instructor ? item.instructor.charAt(0) : 'A'}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{item.title}</h3>
                                <p className="text-xs text-slate-500">{item.instructor} • {item.time}</p>
                            </div>
                        </div>

                        {/* Delete Button (Visible on Hover) */}
                        <button 
                            onClick={() => handleDelete(item.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-2"
                            title="Delete Post"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* Content */}
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mb-3">
                        {item.description}
                    </p>

                    {/* ✅ IMAGE CAROUSEL (Handles 1 or Multiple Images) */}
                    {item.images && item.images.length > 0 && (
                        <ImageCarousel images={item.images} />
                    )}

                </div>
            ))}

            {announcements.length === 0 && (
                <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p>No announcements yet.</p>
                    <p className="text-sm">Use the form on the left to create one!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;