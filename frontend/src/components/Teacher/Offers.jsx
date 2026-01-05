import React, { useState, useEffect } from 'react';
import { 
  Video, Clock, Tag, Save, Loader2, IndianRupee, Gift, Search, X, Ticket
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Offers = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  
  // --- MODAL & SELECTION STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');

  // --- FORM STATE (Your Original State) ---
  const [activeTab, setActiveTab] = useState('price'); 
  const [offerPrice, setOfferPrice] = useState('');
  const [validity, setValidity] = useState('24 Hours');
  const [couponCode, setCouponCode] = useState('');
  const [isFree, setIsFree] = useState(false);

  const validityOptions = ["24 Hours", "48 Hours", "1 Week", "1 Month", "1 Year"];

  // 1. Fetch Data
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/courses');
      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Helper to find selected course object safely
  const selectedCourse = courses.find(c => c.id.toString() === selectedCourseId.toString());

  // 3. Open Modal & Pre-fill Data (Your logic preserved)
  const handleOpenModal = (course) => {
      setSelectedCourseId(course.id);
      
      // Pre-fill existing data if any
      setOfferPrice(course.discountPrice !== undefined && course.discountPrice !== null ? course.discountPrice : '');
      setCouponCode(course.couponCode || '');
      setValidity(course.validity || '24 Hours');
      setIsFree(Number(course.discountPrice) === 0 && course.discountPrice !== null);
      
      // Auto-switch tab based on data
      if(course.couponCode) setActiveTab('coupon');
      else setActiveTab('price');

      setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setOfferPrice('');
      setCouponCode('');
      setIsFree(false);
  };

  // --- 4. YOUR INSTANT SUBMIT LOGIC (Preserved) ---
  const handleApplyOffer = (e) => {
    e.preventDefault(); 
    
    // Validation
    if (!selectedCourseId) {
        toast.warning("Please select a course first.");
        return;
    }

    let finalPrice = isFree ? 0 : offerPrice;

    if (activeTab === 'price' && (finalPrice === '' || finalPrice === null) && !isFree) {
        toast.warning("Please enter a valid price.");
        return;
    }

    const finalCoupon = activeTab === 'coupon' ? couponCode : "";

    if (activeTab === 'coupon' && !finalCoupon.trim()) {
        toast.warning("Please enter a coupon code.");
        return;
    }

    // ✅ OPTIMISTIC UI UPDATE
    if (activeTab === 'coupon') {
        toast.success(`🎉 Coupon "${finalCoupon}" Created Immediately!`);
    } else {
        toast.success(`✅ Price Updated to ₹${finalPrice} Immediately!`);
    }

    // Update Local State Instantly
    const updatedCourses = courses.map(course => {
        if(course.id.toString() === selectedCourseId.toString()) {
            return {
                ...course,
                price: Number(finalPrice),
                discountPrice: Number(finalPrice),
                hasOffer: true,
                couponCode: finalCoupon || course.couponCode
            };
        }
        return course;
    });
    setCourses(updatedCourses);
    handleCloseModal(); // Close modal immediately

    // Background Save
    const payload = {
        courseId: selectedCourseId,
        offerPrice: Number(finalPrice), 
        validity: validity,
        coupon: finalCoupon
    };

    fetch('http://localhost:5000/api/offers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if(!data.success) {
            toast.error("⚠️ Server failed to save. Please try again.");
        } else {
            console.log("Backend saved successfully");
        }
    })
    .catch(err => {
        console.error(err);
        toast.error("⚠️ Network Error: Could not save to server.");
    });
  };

  // Filter for Grid View
  const filteredCourses = courses.filter(c => 
    (c.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" style={{ zIndex: 999999 }} />

      <div className="min-h-screen bg-gray-50 p-8 animate-in fade-in duration-500 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                      Manage Offers
                  </h1>
                  <p className="text-slate-600">Create discounts or generate coupons for your students.</p>
              </div>
              
              <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search courses..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
              </div>
          </div>

          {/* GRID VIEW OF COURSES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all relative group flex flex-col">
                
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Video size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 line-clamp-1" title={course.title}>{course.title}</h3>
                    <p className="text-xs text-slate-500">{course.category || "General Course"}</p>
                  </div>
                </div>

                {/* Price Display Card (Logic from your flow) */}
                <div className={`rounded-xl p-4 border mb-6 flex-1 flex flex-col justify-center transition-colors ${
                    course.hasOffer ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'
                }`}>
                   {course.hasOffer ? (
                       <div className="space-y-3">
                           <div className="flex justify-between items-center">
                               <div>
                                   <p className="text-[10px] text-slate-400 font-bold uppercase">Original</p>
                                   <p className="text-slate-500 font-medium line-through decoration-slate-400">
                                       ₹{course.originalPrice || course.price}
                                   </p>
                               </div>
                               <div className="text-right">
                                   <p className="text-[10px] text-green-600 font-bold uppercase flex items-center justify-end gap-1">
                                       <Tag size={10} /> Deal Price
                                   </p>
                                   <p className="text-green-600 font-extrabold text-2xl">
                                       {course.displayPrice || `₹${course.discountPrice}`}
                                   </p>
                               </div>
                           </div>
                           {course.couponCode && (
                               <div className="flex items-center gap-2 bg-white border border-dashed border-purple-300 rounded-lg p-2 justify-center shadow-sm">
                                   <Ticket size={14} className="text-purple-500" />
                                   <span className="text-purple-700 font-mono font-bold text-sm tracking-widest">
                                       {course.couponCode}
                                   </span>
                               </div>
                           )}
                       </div>
                   ) : (
                       <div className="text-center py-2 opacity-60">
                           <p className="text-slate-400 text-sm font-medium mb-1">Current Price</p>
                           <p className="text-slate-900 font-bold text-xl">₹{course.price}</p>
                       </div>
                   )}
                </div>

                <button 
                  onClick={() => handleOpenModal(course)}
                  className={`w-full py-3 border-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      course.hasOffer 
                      ? 'border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100' 
                      : 'border-blue-600 bg-white text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {course.hasOffer ? 'Edit Offer' : 'Create Offer'} <Gift size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- POPUP MODAL (Containing YOUR Form Logic) --- */}
      {isModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 relative">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Set Offer</h2>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-[250px]">{selectedCourse.title}</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body: YOUR FORM LOGIC HERE */}
            <div className="p-8">
              
              <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8">
                  <button
                      type="button"
                      onClick={() => setActiveTab('price')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                          activeTab === 'price' 
                          ? 'bg-white text-blue-600 shadow-md' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                      <IndianRupee size={16} /> Update Price
                  </button>
                  <button
                      type="button"
                      onClick={() => setActiveTab('coupon')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                          activeTab === 'coupon' 
                          ? 'bg-white text-purple-600 shadow-md' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                      <Gift size={16} /> Create Coupon
                  </button>
              </div>

              <form onSubmit={handleApplyOffer} className="space-y-6">
                  
                  {activeTab === 'price' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">New Deal Price</label>
                              <div className="relative">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</div>
                                  <input 
                                      type="number" 
                                      value={offerPrice}
                                      onChange={(e) => setOfferPrice(e.target.value)}
                                      className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none font-bold text-blue-600"
                                      placeholder="Example: 499"
                                  />
                              </div>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Validity Period</label>
                              <div className="relative">
                                  <select 
                                      value={validity}
                                      onChange={(e) => setValidity(e.target.value)}
                                      className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none text-slate-700 appearance-none"
                                  >
                                      {validityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                  </select>
                                  <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              </div>
                          </div>
                      </div>
                  )}

                  {activeTab === 'coupon' && (
                      <div className="space-y-6 animate-in fade-in">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Coupon Code</label>
                              <div className="relative">
                                  <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                  <input 
                                      type="text" 
                                      maxLength={15}
                                      value={couponCode}
                                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none font-mono font-bold uppercase tracking-wider text-purple-600"
                                      placeholder="SUMMER2025"
                                  />
                              </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <div className="flex justify-between items-center mb-2">
                                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Discounted Price</label>
                                      <label className="flex items-center cursor-pointer gap-2 select-none">
                                          <input 
                                              type="checkbox" 
                                              checked={isFree} 
                                              onChange={(e) => setIsFree(e.target.checked)} 
                                              className="accent-purple-600 w-4 h-4 rounded cursor-pointer"
                                          />
                                          <span className="text-xs font-bold text-purple-600">Set as Free</span>
                                      </label>
                                  </div>
                                  <div className="relative">
                                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</div>
                                      <input 
                                          type="number" 
                                          value={isFree ? 0 : offerPrice}
                                          disabled={isFree}
                                          onChange={(e) => setOfferPrice(e.target.value)}
                                          className={`w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none font-bold ${
                                              isFree ? 'bg-slate-100 text-slate-400' : 'bg-white text-purple-600'
                                          }`}
                                          placeholder={isFree ? "0" : "Example: 199"}
                                      />
                                  </div>
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Expire In</label>
                                  <div className="relative">
                                      <select 
                                          value={validity}
                                          onChange={(e) => setValidity(e.target.value)}
                                          className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none text-slate-700 appearance-none"
                                      >
                                          {validityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                      </select>
                                      <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  <button 
                      type="submit"
                      className={`w-full text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 ${
                          activeTab === 'price' 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-blue-200' 
                          : 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-purple-200'
                      }`}
                  >
                      {activeTab === 'price' ? <Save size={20} /> : <Gift size={20} />}
                      {activeTab === 'price' ? 'Update Price' : 'Create Coupon'}
                  </button>

              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Offers;