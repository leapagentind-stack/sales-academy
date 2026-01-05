import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, Save, Globe, Linkedin, Briefcase, Camera, CheckCircle, Image, Lock 
} from 'lucide-react';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); 
  
  // State for Image Preview & File Input Ref
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    headline: '',
    description: '',
    website: '',
    linkedin: '',
    email: '',
    initial: ''
  });

  // --- 1. LOAD DATA ON REFRESH ---
  useEffect(() => {
    // 1. Identify the current user (Email is the unique ID)
    const storedUser = localStorage.getItem("user");
    const storedEmail = localStorage.getItem("email");
    let email = storedEmail || "";
    let identifier = "";

    if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser);
            email = parsed.email || storedEmail || "";
            identifier = parsed.name || parsed.email || "";
        } catch(e) { 
            identifier = storedEmail || ""; 
        }
    }

    if (!email) return; // Can't load if no email

    // 2. CHECK FOR SAVED PROFILE DATA (Permanent Data)
    const savedProfileKey = `profile_data_${email}`;
    const savedDataString = localStorage.getItem(savedProfileKey);

    if (savedDataString) {
        // ✅ FOUND SAVED DATA - Load it!
        const savedData = JSON.parse(savedDataString);
        setUserData(savedData);
        if (savedData.profileImage) {
            setImagePreview(savedData.profileImage);
        }
    } else {
        // ❌ NO SAVED DATA - Create Default from Email
        let namePart = identifier.includes("@") ? identifier.split('@')[0] : identifier;
        
        // Remove numbers for cleaner default name
        // namePart = namePart.replace(/[0-9]/g, ''); 
        
        const finalName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const initialChar = finalName.charAt(0).toUpperCase();

        setUserData(prev => ({
            ...prev,
            firstName: finalName,
            lastName: '', 
            email: email,
            initial: initialChar
        }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // --- 2. SAVE DATA PERMANENTLY ---
  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);

    // Create the object to save
    const dataToSave = {
        ...userData,
        profileImage: imagePreview // Save the image string too
    };

    // Save to LocalStorage using a unique key based on their email
    const savedProfileKey = `profile_data_${userData.email}`;
    localStorage.setItem(savedProfileKey, JSON.stringify(dataToSave));

    // OPTIONAL: Update the main "user" object so the Header "A" updates on next login/refresh
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.name = userData.firstName; // Update name in global user object
        localStorage.setItem("user", JSON.stringify(parsed));
    }

    setTimeout(() => {
        setLoading(false);
        alert(`Profile Saved Successfully! Data is now permanent.`);
    }, 1000);
  };

  // Handle Button Click to Open File Manager
  const handleSelectImageClick = () => {
    fileInputRef.current.click();
  };

  // Handle File Selection & Preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        // Automatically update state so it's ready to save
        setUserData(prev => ({ ...prev, profileImage: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header with Avatar */}
      <div className="bg-slate-900 text-white pt-10 pb-20 px-8">
        <div className="max-w-5xl mx-auto flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('picture')}>
                {/* Check if imagePreview exists, show it; otherwise show Initial */}
                {imagePreview ? (
                    <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="h-28 w-28 rounded-full object-cover border-4 border-white/10 shadow-xl"
                    />
                ) : (
                    <div className="h-28 w-28 rounded-full bg-slate-800 flex items-center justify-center text-4xl font-bold border-4 border-white/10 shadow-xl text-white">
                        {userData.initial || "U"}
                    </div>
                )}
                
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                </div>
            </div>
            <div>
                <h1 className="text-3xl font-bold">
                    {userData.firstName} {userData.lastName}
                </h1>
                <p className="text-slate-400 mt-2 font-medium">
                    {userData.headline || "Instructor & Content Creator"}
                </p>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 -mt-10 mb-20">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'profile' ? 'text-slate-900 border-b-2 border-slate-900 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Profile
                </button>
                <button 
                    onClick={() => setActiveTab('picture')}
                    className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'picture' ? 'text-slate-900 border-b-2 border-slate-900 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Profile Picture
                </button>
                <button 
                    onClick={() => setActiveTab('privacy')}
                    className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'privacy' ? 'text-slate-900 border-b-2 border-slate-900 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Privacy Settings
                </button>
            </div>

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
                <form onSubmit={handleSave} className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                                <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none text-slate-800 font-medium"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                                <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full p-3 border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none text-slate-800 font-medium"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
                            <input type="text" name="headline" value={userData.headline} onChange={handleChange} placeholder="Instructor at Sales Academy" className="w-full p-3 border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none text-slate-700"/>
                            <span className="text-xs text-slate-400 mt-1 block">Add a professional headline like, "Instructor at Sales Academy" or "Architect".</span>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Biography</label>
                            <textarea rows="5" name="description" value={userData.description} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none text-slate-700" placeholder="Tell students about your experience..."></textarea>
                        </div>
                        <div className="pt-6 border-t border-slate-100">
                            <label className="block text-sm font-bold text-slate-800 mb-4">Links</label>
                            <div className="space-y-3">
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 border border-r-0 border-slate-300 bg-slate-50 text-slate-500 w-12 justify-center"><Globe size={16} /></span>
                                    <input type="text" name="website" onChange={handleChange} placeholder="Website URL" className="flex-1 block w-full px-3 py-2 border border-slate-300 focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none sm:text-sm" />
                                </div>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 border border-r-0 border-slate-300 bg-slate-50 text-slate-500 w-12 justify-center"><Linkedin size={16} /></span>
                                    <input type="text" name="linkedin" onChange={handleChange} placeholder="LinkedIn Profile" className="flex-1 block w-full px-3 py-2 border border-slate-300 focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none sm:text-sm" />
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button type="submit" disabled={loading} className="px-8 py-3 bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center gap-2">{loading ? 'Saving...' : 'Save'}</button>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-6 border border-slate-200 text-center">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Logged in as</p>
                            <div className="flex justify-center items-center gap-2 text-slate-800 font-bold mb-4"><Mail size={16} className="text-slate-400" />{userData.email}</div>
                        </div>
                    </div>
                </form>
            )}

            {/* TAB: PICTURE */}
            {activeTab === 'picture' && (
                <div className="p-12 text-center animate-in fade-in">
                    
                    {/* Image Preview Box */}
                    <div className="h-40 w-40 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-6 overflow-hidden border-4 border-slate-100 shadow-sm relative">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                            <Image size={48} className="text-slate-400" />
                        )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-800">Photo Upload</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">Upload a clear photo of yourself to help students recognize you.</p>
                    
                    {/* Hidden Input + Button Trigger */}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden" 
                        accept="image/*"
                    />
                    
                    <button 
                        type="button" 
                        onClick={handleSelectImageClick}
                        className="px-6 py-3 border border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-all rounded-lg"
                    >
                        {imagePreview ? 'Change Image' : 'Select Image'}
                    </button>
                    
                    {/* Added Save Button here too, just in case user forgets to go back to Profile tab */}
                    <div className="mt-8">
                        <button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="px-8 py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all rounded-lg"
                        >
                            Save Photo
                        </button>
                    </div>
                </div>
            )}

            {/* TAB: PRIVACY */}
            {activeTab === 'privacy' && (
                <div className="p-12 animate-in fade-in">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Lock size={20} /> Privacy Settings</h3>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                            <input type="checkbox" checked className="w-5 h-5 accent-slate-900" />
                            <span className="text-slate-700 font-medium">Show my profile to logged-in users only</span>
                        </label>
                        <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                            <input type="checkbox" className="w-5 h-5 accent-slate-900" />
                            <span className="text-slate-700 font-medium">Show courses I am taking on my profile page</span>
                        </label>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Profile;