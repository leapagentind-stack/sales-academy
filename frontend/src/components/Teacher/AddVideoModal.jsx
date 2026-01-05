import React from 'react';
import { X, UploadCloud, FileVideo, Image as ImageIcon, Info } from 'lucide-react';

const AddVideoModal = ({ isOpen = true, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add Video Lesson</h2>
            <p className="text-sm text-slate-500">Fill in the details for this module chapter.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
          
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex justify-between">
              Lesson Title <span className="text-red-500 ml-1">*</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g. Introduction to Advanced Sales" 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-slate-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea 
              rows={3}
              placeholder="Briefly describe what students will learn..." 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-slate-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm resize-none"
            />
          </div>

          {/* Grid for smaller inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                Content Points
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </label>
              <input 
                type="text" 
                placeholder="Key topics (comma separated)" 
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Prerequisites</label>
              <input 
                type="text" 
                placeholder="Required prior knowledge" 
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Upload Section - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            
            {/* Video Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Video Source *</label>
              <div className="group relative h-32 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center text-center">
                <div className="p-2 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                  <FileVideo className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-xs font-semibold text-slate-600">Upload Video</span>
                <span className="text-[10px] text-slate-400 mt-0.5">MP4, MKV up to 2GB</span>
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Lesson Thumbnail *</label>
              <div className="group relative h-32 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-pink-500 hover:bg-pink-50/50 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center text-center">
                <div className="p-2 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-5 h-5 text-pink-500" />
                </div>
                <span className="text-xs font-semibold text-slate-600">Upload Cover</span>
                <span className="text-[10px] text-slate-400 mt-0.5">16:9 Ratio recommended</span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 rounded-b-2xl flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-1 focus:ring-gray-200 transition-all"
          >
            Cancel
          </button>
          <button className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 shadow-sm shadow-indigo-200 transition-all">
            Add Lesson
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddVideoModal;