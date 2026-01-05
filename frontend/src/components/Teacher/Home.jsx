import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { 
  GraduationCap, Users, Star, Video, Play, BookOpen, IndianRupee, X, Loader2,
  Calendar, Mail, Bell, Search, Send, CheckCheck,
  Percent, Tag, Clock, Save, ChevronRight,
  Megaphone, Trash2, Plus, Image as ImageIcon
} from 'lucide-react';

// --- 1. SLIDER LOGIC: Flattens ALL announcements into a single continuous slideshow ---
const HeroAnnouncementSlider = ({ announcements }) => {
    const [current, setCurrent] = useState(0);

    // Combine ALL images from ALL announcements into one long list
    const slides = useMemo(() => {
        if (!announcements || announcements.length === 0) return [];
        
        let allSlides = [];
        
        // Loop through every announcement
        announcements.forEach(item => {
            if (item.images && item.images.length > 0) {
                // If it has images, create a slide for EACH image
                item.images.forEach(img => {
                    allSlides.push({ 
                        title: item.title,
                        content: item.description || item.content,
                        time: item.time,
                        displayImage: img,
                        isNew: true 
                    });
                });
            } else {
                // Fallback for text-only announcements
                allSlides.push({ 
                    title: item.title,
                    content: item.description || item.content,
                    time: item.time,
                    displayImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop",
                    isNew: true 
                });
            }
        });
        return allSlides;
    }, [announcements]);

    // Auto Scroll
    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 4000); // 4 Seconds per slide
        return () => clearInterval(interval);
    }, [slides.length]);

    if (slides.length === 0) {
        return (
            <div className="w-full h-[400px] rounded-2xl bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center text-white mb-12 shadow-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">Welcome to Sales Academy</h1>
                    <p className="text-lg opacity-90">No active announcements.</p>
                </div>
            </div>
        );
    }

    const item = slides[current];

    return (
        <div className="w-full relative h-[400px] rounded-2xl overflow-hidden mb-12 shadow-2xl group transition-all duration-500">
            <img 
                src={item.displayImage} 
                alt="Announcement" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-3xl animate-in slide-in-from-bottom-4 fade-in duration-700 key={current}">
                <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        New Update
                    </span>
                    <span className="text-slate-300 text-sm font-medium flex items-center gap-1">
                        <Clock size={14} /> {item.time}
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight shadow-sm">
                    {item.title}
                </h1>
                <p className="text-lg text-slate-200 line-clamp-2 leading-relaxed">
                    {item.content}
                </p>
            </div>

            {/* Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 right-8 flex gap-2">
                    {slides.map((_, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setCurrent(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === current ? 'bg-white scale-150' : 'bg-white/40 hover:bg-white/80'}`} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const Home = () => {
  const { loading: contextLoading } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Sales');
  const [localCourses, setLocalCourses] = useState([]);
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [viewingCourseStudents, setViewingCourseStudents] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  
  const coursesRef = useRef(null);
  const [userName, setUserName] = useState('Instructor');

  // --- DATA STATES ---
  const [announcementsList, setAnnouncementsList] = useState([]); // Empty initially, fetches from DB
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Course Sale', message: 'Student User 42 purchased Sales Mastery', time: '2 min ago', read: false, type: 'sale' },
    { id: 2, title: 'System Update', message: 'Dashboard maintenance scheduled', time: '1 hour ago', read: false, type: 'system' }
  ]);

  // --- FORM STATES ---
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [offerForm, setOfferForm] = useState({ courseId: '', offerPrice: '', validity: '24 Hours', coupon: '' });

  const [activeChatId, setActiveChatId] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const chatEndRef = useRef(null);
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Rahul Sharma', avatar: 'R', status: 'online', lastMessage: 'I have a doubt.', unread: 2, time: '10:30 AM', messages: [] }
  ]);

  const categories = ["Sales", "CRM", "Sales & CRM"];
  const validityOptions = ["24 Hours", "48 Hours", "1 Week", "1 Month", "1 Year"];

  // --- 1. FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch Courses
            const coursesRes = await axios.get('http://localhost:5000/api/courses');
            setLocalCourses(coursesRes.data.map(c => ({
                ...c, 
                studentCount: c.purchasers ? c.purchasers.length : 0,
                originalPrice: c.originalPrice || c.original_price || null,
                hasOffer: (c.originalPrice || c.original_price) ? true : false
            })));

            // Fetch Announcements (Permanent DB Storage)
            const announceRes = await axios.get('http://localhost:5000/api/announcements');
            setAnnouncementsList(announceRes.data);

        } catch (error) {
            console.error("Data fetch error:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser);
            let namePart = (parsed.name || parsed.email || "").split('@')[0];
            setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
        } catch(e) {}
    }
  }, []);

  useEffect(() => {
    if (location.pathname.includes('/offers')) setCurrentView('offers');
    else if (location.pathname.includes('/messages')) setCurrentView('messages');
    else if (location.pathname.includes('/notifications')) setCurrentView('notifications');
    else if (location.pathname.includes('/announcements')) setCurrentView('announcements');
    else setCurrentView('dashboard');
  }, [location]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) return alert("Max 5 images allowed");
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // --- 2. PERMANENT SAVE TO DB ---
  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementForm.title || !announcementForm.content) return;

    try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('title', announcementForm.title);
        formData.append('description', announcementForm.content);
        selectedImages.forEach(file => formData.append('images', file));

        // Save to Backend
        const res = await axios.post('http://localhost:5000/api/announcements', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Add to local state immediately
        const newPost = {
            ...res.data.data,
            instructor: userName,
            time: "Just now",
            isNew: true
        };
        
        setAnnouncementsList([newPost, ...announcementsList]);
        setAnnouncementForm({ title: '', content: '' });
        setSelectedImages([]);
        setPreviewUrls([]);
        setShowAnnouncementModal(false);

    } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to post announcement");
    } finally {
        setIsUploading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
      if(!window.confirm("Delete this announcement?")) return;
      try {
          await axios.delete(`http://localhost:5000/api/announcements/${id}`);
          setAnnouncementsList(prev => prev.filter(item => item.id !== id));
      } catch (error) {
          console.error("Delete failed", error);
      }
  };
  
  const handleViewStudentList = (course, e) => {
    e.stopPropagation();
    setViewingCourseStudents(course);
    setShowStudentListModal(true);
  };

  const handleApplyOffer = (e) => {
    e.preventDefault();
    if (!offerForm.courseId || !offerForm.offerPrice) return;
    setLocalCourses(prev => prev.map(c => c.id.toString() === offerForm.courseId.toString() ? { ...c, originalPrice: c.originalPrice || c.price, price: offerForm.offerPrice, hasOffer: true } : c));
    setOfferForm({ courseId: '', offerPrice: '', validity: '24 Hours', coupon: '' });
  };

  const filteredCourses = localCourses.filter(course => (course.category || 'Sales') === activeCategory);
  const totalRevenue = localCourses.reduce((acc, curr) => acc + (Number(curr.price || 0) * (curr.studentCount || 0)), 0);
  const totalActiveStudents = localCourses.reduce((acc, curr) => acc + (curr.studentCount || 0), 0);
  const activeConversation = conversations.find(c => c.id === activeChatId);
  const selectedCourse = localCourses.find(c => c.id.toString() === offerForm.courseId.toString());

  return (
    <div className="min-h-screen bg-white relative">
      <div className="p-8 w-full">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
               {currentView === 'dashboard' ? 'Dashboard' : 
                currentView === 'messages' ? 'Messages' : 
                currentView === 'offers' ? 'Manage Offers' : 
                currentView === 'announcements' ? 'Announcements' : 'Notifications'}
            </h1>
            <p className="text-slate-600 text-base">
               {currentView === 'dashboard' ? `Welcome back, ${userName}!` : 'Manage your academy details.'}
            </p>
          </div>
          {currentView === 'dashboard' && (
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-full shadow-sm border border-slate-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700">Live</span>
              </div>
          )}
        </div>

        {currentView === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* ✅ FIXED SLIDER: Shows ALL photos from ALL announcements sequentially */}
            <HeroAnnouncementSlider announcements={announcementsList} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 hover:-translate-y-1 transition-all">
                <div className="flex justify-between mb-4">
                  <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white"><IndianRupee size={26} /></div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Live</div>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase">Total Revenue</p>
                <h2 className="text-3xl font-bold text-emerald-700">₹{totalRevenue.toLocaleString()}</h2>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:-translate-y-1 transition-all">
                <div className="flex justify-between mb-4">
                  <div className="h-14 w-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white"><GraduationCap size={26} /></div>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase">Total Courses</p>
                <h2 className="text-3xl font-bold text-blue-700">{loading ? "..." : localCourses.length}</h2>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 hover:-translate-y-1 transition-all">
                 <div className="flex justify-between mb-4">
                  <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white"><Users size={26} /></div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">+12%</div>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase">Active Students</p>
                <h2 className="text-4xl font-bold text-emerald-700">{totalActiveStudents}</h2>
              </div>
               <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:-translate-y-1 transition-all">
                 <div className="flex justify-between mb-4">
                  <div className="h-14 w-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white"><Star size={26} /></div>
                  <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">Excellent</div>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase">Satisfaction</p>
                <h2 className="text-4xl font-bold text-slate-700">4.8/5</h2>
              </div>
               <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 hover:-translate-y-1 transition-all">
                 <div className="flex justify-between mb-4">
                  <div className="h-14 w-14 bg-purple-500 rounded-2xl flex items-center justify-center text-white"><Video size={26} /></div>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase">Live Classes</p>
                <h2 className="text-4xl font-bold text-slate-700">3<span className="text-lg text-slate-400">/week</span></h2>
              </div>
            </div>

            <div ref={coursesRef} className="w-full bg-white rounded-3xl shadow-xl border border-blue-100 p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-1">Explore Courses</h3>
                    <p className="text-slate-500 text-sm">Discover courses tailored to your growth</p>
                  </div>
                  <div className="flex bg-slate-100 p-1.5 rounded-xl shadow-inner">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                
                {loading ? <div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={40} /></div> : 
                 filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredCourses.map((course) => (
                      <div key={course.id} className="group bg-white rounded-2xl p-4 flex flex-col hover:shadow-2xl border border-blue-100 hover:-translate-y-1 transition-all">
                        <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-200 relative mb-4">
                          {course.thumbnail_url ? (
                            <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-400"><Play size={48} /></div>}
                          {course.hasOffer && <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md animate-pulse">OFFER</div>}
                        </div>
                        <h4 className="text-slate-800 text-lg font-bold line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                             <span className="bg-blue-50 px-2 py-1 rounded flex items-center gap-1"><Video size={10} /> {course.lessons?.length || 0} Lessons</span>
                             <button onClick={(e) => handleViewStudentList(course, e)} className="bg-green-50 px-2 py-1 rounded flex items-center gap-1 font-bold text-green-700 cursor-pointer hover:bg-green-100"><Users size={10} /> {course.studentCount || 0} Enrolled</button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                              <div className="flex flex-col">
                                  {course.originalPrice && <span className="text-slate-400 text-xs font-medium line-through">₹{course.originalPrice}</span>}
                                  <span className="text-emerald-600 font-bold text-lg">₹{course.price}</span>
                              </div>
                              <button className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all text-sm">Buy Now</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center py-20 text-slate-500">No courses found.</div>}
            </div>
          </div>
        )}

        {currentView === 'announcements' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100">
                   <div className="flex justify-between items-center mb-8">
                       <div><h3 className="text-2xl font-bold text-slate-800">Announcements</h3><p className="text-slate-500 text-sm">Manage your academy details.</p></div>
                       <button onClick={() => setShowAnnouncementModal(true)} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg"><Plus size={20} /> Add Announcement</button>
                   </div>
                   
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                       <h4 className="font-bold text-slate-800 mb-4 text-lg">Announcements</h4>
                       {announcementsList.length > 0 ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                               {announcementsList.map((item) => (
                                  <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative group">
                                      <div className="flex justify-between items-start mb-2">
                                          <h5 className="font-bold text-slate-800">{item.title}</h5>
                                          <button onClick={() => handleDeleteAnnouncement(item.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                                      </div>
                                      <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                                      {item.images && item.images.length > 0 && (
                                          <div className="flex gap-2 overflow-x-auto pb-2">
                                              {item.images.map((img, idx) => (
                                                  <img key={idx} src={img} className="w-16 h-16 object-cover rounded-lg border border-slate-200" alt="thumb" />
                                              ))}
                                          </div>
                                      )}
                                  </div>
                               ))}
                           </div>
                       ) : <div className="text-center text-slate-400 py-10">No announcements posted yet.</div>}
                   </div>
                </div>
             </div>
        )}

        {showAnnouncementModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                    <div className="flex justify-between items-center p-6 border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800">Add Announcement</h3>
                        <button onClick={() => setShowAnnouncementModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                    </div>
                    <form onSubmit={handlePostAnnouncement} className="p-6 space-y-5">
                        <div><label className="block text-sm font-bold text-slate-700 mb-2">Title</label><input type="text" required value={announcementForm.title} onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none" /></div>
                        <div><label className="block text-sm font-bold text-slate-700 mb-2">Message</label><textarea rows="4" required value={announcementForm.content} onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none resize-none"></textarea></div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Attach Photos</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 relative cursor-pointer group">
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <div className="flex flex-col items-center justify-center py-2"><div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2"><ImageIcon size={20} /></div><span className="text-sm font-medium text-slate-600">Click to upload images</span></div>
                            </div>
                            {previewUrls.length > 0 && <div className="flex gap-2 mt-3 overflow-x-auto pb-2">{previewUrls.map((url, idx) => (<div key={idx} className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border"><img src={url} className="w-full h-full object-cover" /><button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5"><X size={12} /></button></div>))}</div>}
                        </div>
                        <button type="submit" disabled={isUploading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg mt-2 flex justify-center gap-2">
                            {isUploading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Post Announcement</>}
                        </button>
                    </form>
                </div>
            </div>
        )}

        {/* Other Views (Offers, Notifications, Messages) remain identical */}
        {currentView === 'offers' && (
             <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Set Course Offer</h2>
                    <form onSubmit={handleApplyOffer} className="space-y-6">
                        <div><label className="block text-sm font-bold text-slate-700 mb-2">Select Course</label><select value={offerForm.courseId} onChange={(e) => setOfferForm({...offerForm, courseId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"><option value="">-- Choose a Course --</option>{localCourses.map(course => (<option key={course.id} value={course.id}>{course.title}</option>))}</select></div>
                        {selectedCourse && (
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Offer Price</label><input type="number" value={offerForm.offerPrice} onChange={(e) => setOfferForm({...offerForm, offerPrice: e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none font-bold text-emerald-600" /></div>
                                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Validity</label><select value={offerForm.validity} onChange={(e) => setOfferForm({...offerForm, validity: e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none">{validityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                                </div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Coupon</label><input type="text" maxLength={10} value={offerForm.coupon} onChange={(e) => setOfferForm({...offerForm, coupon: e.target.value.toUpperCase()})} className="w-full px-4 py-3 border rounded-xl outline-none uppercase" /></div>
                                <button type="submit" className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg">Publish Offer</button>
                            </div>
                        )}
                    </form>
                </div>
             </div>
        )}

        {currentView === 'notifications' && (
           <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"><h3 className="font-bold text-slate-800 text-lg">Notifications</h3><button className="text-sm text-blue-600 font-medium">Mark all as read</button></div>
                <div className="divide-y divide-slate-100">{notifications.map((n) => (<div key={n.id} className="p-6 flex gap-4 hover:bg-slate-50"><div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600"><Bell size={18} /></div><div className="flex-1"><h4 className="font-semibold text-slate-800 text-sm">{n.title}</h4><p className="text-slate-600 text-sm">{n.message}</p></div></div>))}</div>
             </div>
           </div>
        )}

        {currentView === 'messages' && (
          <div className="h-[calc(100vh-180px)] bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden flex animate-in fade-in">
            <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
              <div className="p-4 border-b border-slate-100"><input type="text" placeholder="Search students..." className="w-full px-4 py-2 bg-slate-100 rounded-lg text-sm outline-none"/></div>
              <div className="flex-1 overflow-y-auto">{conversations.map(chat => (<div key={chat.id} onClick={() => setActiveChatId(chat.id)} className={`p-4 flex gap-3 cursor-pointer border-b border-slate-50 ${activeChatId === chat.id ? 'bg-blue-50/50' : ''}`}><div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">{chat.avatar}</div><div className="flex-1"><h4 className="text-sm font-semibold">{chat.name}</h4><p className="text-xs text-slate-500">{chat.lastMessage}</p></div></div>))}</div>
            </div>
            <div className="flex-1 flex flex-col bg-white">
               {activeConversation ? (
                 <>
                   <div className="p-4 border-b border-slate-100 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold">{activeConversation.avatar}</div><h3 className="font-bold text-slate-800">{activeConversation.name}</h3></div>
                   <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50"><div ref={chatEndRef} /></div>
                   <div className="p-4 bg-white border-t border-slate-100"><form onSubmit={handleSendMessage} className="flex gap-3"><input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type message..." className="flex-1 bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none"/><button type="submit" className="p-3 bg-blue-600 text-white rounded-xl"><Send size={18} /></button></form></div>
                 </>
               ) : <div className="h-full flex items-center justify-center text-slate-400">Select a conversation</div>}
            </div>
          </div>
        )}

        {showStudentListModal && viewingCourseStudents && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden h-[600px] flex flex-col">
                <div className="bg-white border-b border-slate-100 p-6 flex justify-between sticky top-0"><h2 className="text-xl font-bold">Purchased List</h2><button onClick={() => setShowStudentListModal(false)}><X size={20} /></button></div>
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                   {viewingCourseStudents.purchasers?.length > 0 ? (
                      <table className="w-full text-left"><thead className="bg-slate-50 border-b"><tr><th className="p-4 text-xs font-bold text-slate-500">Name</th><th className="p-4 text-xs font-bold text-slate-500">Email</th></tr></thead><tbody>{viewingCourseStudents.purchasers.map((s, i) => (<tr key={i}><td className="p-4">{s.name}</td><td className="p-4">{s.email}</td></tr>))}</tbody></table>
                   ) : <div className="text-center text-slate-400 mt-10">No students yet</div>}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;