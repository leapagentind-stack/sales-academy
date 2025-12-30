import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDashboard } from '../../context/DashboardContext';
import { 
  GraduationCap, 
  Users, 
  Star, 
  Video, 
  Play,
  BookOpen,
  IndianRupee,
  X,
  Loader2,
  Calendar,
  Mail,
  Bell,
  Search,
  Send,
  MoreVertical,
  CheckCheck,
  Phone,
  Video as VideoIcon,
  MessageSquare
} from 'lucide-react';

const Home = () => {
  const { loading: contextLoading } = useDashboard();
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Sales');
  const [localCourses, setLocalCourses] = useState([]);
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [viewingCourseStudents, setViewingCourseStudents] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  
  const [notifications] = useState([
    { id: 1, title: 'New Course Sale', message: 'Student User 42 purchased Sales Mastery', time: '2 min ago', read: false, type: 'sale' },
    { id: 2, title: 'System Update', message: 'Dashboard maintenance scheduled for tonight', time: '1 hour ago', read: false, type: 'system' },
    { id: 3, title: 'New Review', message: 'You received a 5-star rating', time: '3 hours ago', read: true, type: 'review' }
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const chatEndRef = useRef(null);

  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      avatar: 'R',
      status: 'online',
      lastMessage: 'I have a doubt regarding the CRM module.',
      unread: 2,
      time: '10:30 AM',
      messages: [
        { id: 1, text: 'Hello sir, good morning!', sender: 'user', time: '10:28 AM' },
        { id: 2, text: 'I have a doubt regarding the CRM module.', sender: 'user', time: '10:30 AM' }
      ]
    }
  ]);

  const categories = ["Sales", "CRM", "Sales & CRM"];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/courses');
      const data = response.data.map(course => ({
        ...course,
        purchasers: course.purchasers || [],
        studentCount: course.purchasers ? course.purchasers.length : 0
      }));
      setLocalCourses(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (currentView === 'messages' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, activeChatId, currentView]);

  const filteredCourses = localCourses.filter(course => {
    const courseCat = course.category || 'Sales'; 
    return courseCat === activeCategory;
  });

  const handleViewStudentList = (course, e) => {
    e.stopPropagation();
    setViewingCourseStudents(course);
    setShowStudentListModal(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: 'me',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeChatId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageInput,
          time: 'Just now'
        };
      }
      return conv;
    }));
    setMessageInput('');
  };

  const activeConversation = conversations.find(c => c.id === activeChatId);

  const totalRevenue = localCourses.reduce((acc, curr) => acc + (Number(curr.price || 0) * (curr.studentCount || 0)), 0);
  const totalCoursesCount = localCourses.length;
  const totalActiveStudents = localCourses.reduce((acc, curr) => acc + (curr.studentCount || 0), 0);

  return (
    <div className="min-h-screen bg-white relative">
      <div className="p-8 w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {currentView === 'dashboard' ? 'Dashboard' : currentView === 'messages' ? 'Messages' : 'Notifications'}
              </h1>
            </div>
            <p className="text-slate-600 text-base">
              {currentView === 'dashboard' && "Welcome back! Here's your academy overview."}
              {currentView === 'messages' && "Manage your student communications."}
              {currentView === 'notifications' && "Stay updated with latest activities."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {currentView === 'dashboard' && (
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-full shadow-sm border border-slate-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700">Live</span>
              </div>
            )}
          </div>
        </div>

        {currentView === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
              <div className="bg-white p-6 rounded-2xl shadow-lg shadow-emerald-100/50 border border-emerald-100 group hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <IndianRupee size={26} />
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">Live</div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Total Revenue</p>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                    ₹{totalRevenue.toLocaleString()}
                  </h2>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 group hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <GraduationCap size={26} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Total Courses</p>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {loading ? "..." : totalCoursesCount}
                  </h2>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg shadow-emerald-100/50 border border-emerald-100 group hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Users size={26} />
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold">+12%</div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Active Students</p>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                    {totalActiveStudents}
                  </h2>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 group hover:translate-y-[-4px] transition-all">
                <div className="flex items-start justify-between mb-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Star size={26} fill="white" />
                    </div>
                    <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-semibold">Excellent</div>
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Satisfaction</p>
                    <h2 className="text-4xl font-bold text-slate-700">4.8/5</h2>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 group hover:translate-y-[-4px] transition-all">
                <div className="flex items-start justify-between mb-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Video size={26} />
                    </div>
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Live Classes</p>
                    <h2 className="text-4xl font-bold text-slate-700">3<span className="text-lg text-slate-400">/week</span></h2>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-100 p-8">
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
                        activeCategory === cat
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                          : 'text-slate-600 hover:bg-white/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              {loading ? (
                  <div className="flex justify-center py-24"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
              ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <div 
                      key={course.id} 
                      className="group bg-white rounded-2xl p-5 flex flex-col hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 border border-blue-100 hover:-translate-y-1"
                    >
                      <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-200 relative mb-4">
                        {course.thumbnail_url ? (
                          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-400"><Play size={48} /></div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h4 className="text-slate-800 text-lg font-bold line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                          <span className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-lg">
                            <Video size={12} className="text-blue-600" /> {course.lessons?.length || 0} Lessons
                          </span>
                          <button 
                            onClick={(e) => handleViewStudentList(course, e)}
                            className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-lg hover:bg-green-100 hover:ring-2 ring-green-200 cursor-pointer transition-all"
                          >
                            <Users size={12} className="text-green-600" />
                            <span className="font-bold text-green-700">{course.studentCount || 0} Enrolled</span>
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                            <span className="text-emerald-600 font-bold text-lg">₹{course.price}</span>
                            <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                                Buy Now
                            </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500">No courses found.</div>
              )}
            </div>
          </div>
        )}

        {currentView === 'notifications' && (
           <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-blue-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 text-lg">All Notifications</h3>
                  <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Mark all as read</button>
                </div>
                <div className="divide-y divide-slate-100">
                   {notifications.map((notification) => (
                     <div key={notification.id} className={`p-6 flex gap-4 hover:bg-slate-50 transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`}>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                          notification.type === 'sale' ? 'bg-green-100 text-green-600' :
                          notification.type === 'system' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                           {notification.type === 'sale' ? <IndianRupee size={18} /> : 
                            notification.type === 'system' ? <Video size={18} /> : <Star size={18} />}
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-start mb-1">
                              <h4 className="font-semibold text-slate-800 text-sm">{notification.title}</h4>
                              <span className="text-xs text-slate-400 whitespace-nowrap">{notification.time}</span>
                           </div>
                           <p className="text-slate-600 text-sm leading-relaxed">{notification.message}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           </div>
        )}

        {currentView === 'messages' && (
          <div className="h-[calc(100vh-180px)] bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-blue-100 overflow-hidden flex animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
              <div className="p-4 border-b border-slate-100">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Search students..." className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-200 outline-none"/>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                 {conversations.map(chat => (
                   <div key={chat.id} onClick={() => setActiveChatId(chat.id)} className={`p-4 flex gap-3 cursor-pointer transition-colors border-b border-slate-50 ${activeChatId === chat.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                     <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">{chat.avatar}</div>
                        {chat.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                           <h4 className={`text-sm font-semibold truncate ${activeChatId === chat.id ? 'text-blue-700' : 'text-slate-700'}`}>{chat.name}</h4>
                           <span className="text-xs text-slate-400">{chat.time}</span>
                        </div>
                        <p className={`text-xs truncate ${chat.unread > 0 ? 'font-bold text-slate-700' : 'text-slate-500'}`}>{chat.lastMessage}</p>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
            <div className="flex-1 flex flex-col bg-white">
               {activeConversation ? (
                 <>
                   <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-white flex items-center justify-center font-bold shadow-sm">{activeConversation.avatar}</div>
                         <div>
                            <h3 className="font-bold text-slate-800">{activeConversation.name}</h3>
                            <span className="text-xs text-green-500 font-medium flex items-center gap-1">{activeConversation.status === 'online' ? '● Online' : 'Offline'}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                      {activeConversation.messages.map((msg) => (
                        <div key={msg.id} className={`flex mb-4 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${msg.sender === 'me' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'}`}>
                              <p className="text-sm">{msg.text}</p>
                              <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${msg.sender === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>{msg.time} {msg.sender === 'me' && <CheckCheck size={12} />}</div>
                           </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                   </div>
                   <div className="p-4 bg-white border-t border-slate-100">
                      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                         <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type your message..." className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none"/>
                         <button type="submit" disabled={!messageInput.trim()} className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"><Send size={18} /></button>
                      </form>
                   </div>
                 </>
               ) : <div className="h-full flex items-center justify-center text-slate-400"><p>Select a conversation</p></div>}
            </div>
          </div>
        )}
      </div>

      {showStudentListModal && viewingCourseStudents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden h-[600px] flex flex-col">
              <div className="bg-white border-b border-slate-100 p-6 flex items-center justify-between sticky top-0 z-10">
                 <div>
                    <h2 className="text-xl font-bold text-slate-800">Purchased List</h2>
                    <p className="text-sm text-slate-500 flex items-center gap-2 mt-1"><BookOpen size={14} /> {viewingCourseStudents.title}</p>
                 </div>
                 <button onClick={() => setShowStudentListModal(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full"><X size={20} className="text-slate-600" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                 {viewingCourseStudents.purchasers && viewingCourseStudents.purchasers.length > 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                       <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-50 border-b">
                             <tr><th className="p-4 text-xs font-bold text-slate-500 uppercase">Student Name</th><th className="p-4 text-xs font-bold text-slate-500 uppercase">Email</th><th className="p-4 text-xs font-bold text-slate-500 uppercase">Purchase Date</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {viewingCourseStudents.purchasers.map((student, index) => (
                                <tr key={index} className="hover:bg-slate-50">
                                   <td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">{student.name.charAt(0)}</div><span className="font-medium text-slate-700">{student.name}</span></div></td>
                                   <td className="p-4 text-slate-600 text-sm">{student.email}</td>
                                   <td className="p-4 text-slate-500 text-sm">{student.purchaseDate}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 ) : <div className="h-full flex flex-col items-center justify-center text-center text-slate-400"><Users size={32} className="text-slate-300 mb-4" /><p className="font-medium text-slate-600">No students yet</p></div>}
              </div>
              <div className="bg-white border-t border-slate-100 p-4 flex justify-between items-center text-sm text-slate-500">
                 <span>Total Enrolled: <strong className="text-slate-800">{viewingCourseStudents.studentCount || 0}</strong></span>
                 <button onClick={() => setShowStudentListModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg">Close</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Home;