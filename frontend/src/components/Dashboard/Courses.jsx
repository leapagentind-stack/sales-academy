import React, { useState, useEffect, useRef } from 'react';
import {
    Video, Plus, X, Upload, Trash2, Play, Pause,
    BookOpen, Lock, CheckCircle,
    ArrowLeft, User, Image as ImageIcon,
    List, LayoutGrid, Loader2,
    Edit, ThumbsUp, Share2, Check, MessageSquare, 
    MoreVertical, ChevronDown, ChevronUp, Clock,
    Link as LinkIcon, Facebook, Twitter, Linkedin, Mail,
    Volume2, Volume1, VolumeX, Settings, Maximize, ExternalLink,
    CreditCard, Star
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/courses';
const API_COMMENTS_URL = 'http://localhost:5000/api/comments'; 
const API_DOWNLOAD_URL = 'http://localhost:5000/api/assignments/download';

const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };
        video.onerror = () => reject("Error loading video");
        video.src = URL.createObjectURL(file);
    });
};

const formatDurationHelper = (seconds) => {
    if(!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

const formatDate = (dateString) => {
    if(!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const StarDisplay = ({ rating, size = 14 }) => {
    const numRating = Number(rating) || 0;
    return (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                    key={star} 
                    size={size} 
                    fill={star <= numRating ? "#eab308" : "none"} 
                    color={star <= numRating ? "#eab308" : "#cbd5e1"} 
                />
            ))}
        </div>
    );
};

const CommentItem = ({ comment, allComments, activeReplyId, setActiveReplyId, replyText, setReplyText, onPostReply, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const isReplying = activeReplyId === comment.id;
    
    const isRootComment = !comment.parent_id;

    const children = allComments
        .filter(c => c.parent_id === comment.id)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    useEffect(() => {
        const handleClickOutside = () => setIsMenuOpen(false);
        if(isMenuOpen) document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMenuOpen]);

    const handleDeleteClick = () => {
        setIsMenuOpen(false);
        if(window.confirm("Are you sure you want to delete this comment?")) {
            onDelete(comment.id);
        }
    };

    return (
        <div style={{ marginTop: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                    <User size={20} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                                    {comment.user_name || 'Student'}
                                </span>
                                {isRootComment && (
                                    <StarDisplay rating={comment.rating} />
                                )}
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    {formatDate(comment.created_at)}
                                </span>
                            </div>
                            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: '1.5' }}>
                                {comment.comment_text}
                            </p>
                        </div>
                        
                        <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                            >
                                <MoreVertical size={16} />
                            </button>
                            {isMenuOpen && (
                                <div style={{ position: 'absolute', right: 0, top: '100%', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 50, minWidth: '120px', overflow: 'hidden' }}>
                                    <button style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', background: 'white', border: 'none', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '0.9rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button 
                                        onClick={handleDeleteClick}
                                        style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', background: 'white', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', alignItems: 'center' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: '#64748b' }}>
                            <ThumbsUp size={14} /> Helpful
                        </button>
                        <button 
                            onClick={() => setActiveReplyId(isReplying ? null : comment.id)} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                            Reply
                        </button>
                    </div>

                    {isReplying && (
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>S</div>
                            <div style={{ flex: 1 }}>
                                <input 
                                    type="text" 
                                    value={replyText} 
                                    onChange={(e) => setReplyText(e.target.value)} 
                                    placeholder={`Reply to ${comment.user_name}...`} 
                                    autoFocus
                                    style={{ width: '100%', border: 'none', borderBottom: '1px solid #e2e8f0', padding: '0.5rem 0', outline: 'none', fontSize: '0.9rem', backgroundColor: 'transparent' }} 
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <button onClick={() => setActiveReplyId(null)} style={{ padding: '0.4rem 0.8rem', borderRadius: '16px', border: 'none', background: 'transparent', fontWeight: '600', cursor: 'pointer', color: '#64748b', fontSize:'0.85rem' }}>Cancel</button>
                                    <button 
                                        onClick={() => onPostReply(comment.id)} 
                                        disabled={!replyText.trim()} 
                                        style={{ padding: '0.4rem 0.8rem', borderRadius: '16px', border: 'none', background: replyText.trim() ? '#3b82f6' : '#e2e8f0', color: replyText.trim() ? 'white' : '#94a3b8', fontWeight: '600', cursor: replyText.trim() ? 'pointer' : 'default', fontSize:'0.85rem' }}>
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {children.length > 0 && (
                <div style={{ paddingLeft: '3.5rem', marginTop: '0.5rem' }}>
                    <button 
                        onClick={() => setShowReplies(!showReplies)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}
                    >
                        {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {showReplies ? 'Hide replies' : `View ${children.length} replies`}
                    </button>

                    {showReplies && (
                        <div style={{ marginTop: '0.5rem' }}>
                            {children.map(child => (
                                <CommentItem 
                                    key={child.id} 
                                    comment={child} 
                                    allComments={allComments}
                                    activeReplyId={activeReplyId}
                                    setActiveReplyId={setActiveReplyId}
                                    replyText={replyText}
                                    setReplyText={setReplyText}
                                    onPostReply={onPostReply}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const Courses = () => {
    const [currentPage, setCurrentPage] = useState('manage');
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [editingCourseId, setEditingCourseId] = useState(null);
    const [courseMeta, setCourseMeta] = useState({ title: '', instructor: '', price: '', thumbnailFile: null, category: 'Sales' });
    
    const [modules, setModules] = useState([{ id: Date.now(), title: 'Module 1', videos: [] }]);
    const [activeModuleIndex, setActiveModuleIndex] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLessonId, setEditingLessonId] = useState(null);
    
    const [modalData, setModalData] = useState({
        title: '', description: '', content: '', requirements: '', videoFile: null, thumbnailFile: null, video_url: '', thumbnail_url: '', duration: ''
    });

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [activeLessonIndex, setActiveLessonIndex] = useState({ moduleIdx: 0, videoIdx: 0 });
    const [completedAssignments, setCompletedAssignments] = useState([]);

    const videoRef = useRef(null);
    const playerContainerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isHoveringPlayer, setIsHoveringPlayer] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1.0);

    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [isPostingComment, setIsPostingComment] = useState(false);
    
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentCourse, setPaymentCourse] = useState(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const [newRating, setNewRating] = useState(0);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            const { moduleIdx, videoIdx } = activeLessonIndex;
            if(selectedCourse.modules[moduleIdx] && selectedCourse.modules[moduleIdx].videos[videoIdx]) {
                const lessonId = selectedCourse.modules[moduleIdx].videos[videoIdx].id;
                if(lessonId) {
                    fetchComments(lessonId);
                }
            }
        }
    }, [activeLessonIndex, selectedCourse]);

    const fetchCourses = async () => {
        try {
            const response = await fetch(API_BASE_URL);
            const data = await response.json();
            
            const coursesWithRatings = await Promise.all(data.map(async (course) => {
                let totalRating = 0;
                let reviewCount = 0;
                
                if(course.lessons) {
                    for(const lesson of course.lessons) {
                        try {
                            const cRes = await fetch(`${API_COMMENTS_URL}/${lesson.id}`);
                            if(cRes.ok) {
                                const cData = await cRes.json();
                                cData.forEach(c => {
                                    if(c.rating > 0) {
                                        totalRating += c.rating;
                                        reviewCount++;
                                    }
                                });
                            }
                        } catch(e) {}
                    }
                }

                return {
                    ...course,
                    avgRating: reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0,
                    totalReviews: reviewCount
                };
            }));

            setCourses(coursesWithRatings);
        } catch (error) {
            console.error(error);
            setCourses([]);
        }
    };

    const fetchComments = async (lessonId) => {
        try {
            const response = await fetch(`${API_COMMENTS_URL}/${lessonId}`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            } else {
                setComments([]);
            }
        } catch (error) {
            console.error(error);
            setComments([]);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course permanently?")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/${courseId}`, { method: 'DELETE' });
            if (response.ok) {
                setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const groupLessonsIntoModules = (lessons) => {
        if (!lessons || lessons.length === 0) return [{ id: Date.now(), title: 'Module 1', videos: [] }];

        const modulesMap = new Map();

        lessons.forEach(lesson => {
            const rawTitle = lesson.module_title || lesson.moduleTitle || 'Module 1';
            const order = lesson.module_order !== undefined ? lesson.module_order : (lesson.moduleOrder !== undefined ? lesson.moduleOrder : 999);

            if (!modulesMap.has(rawTitle)) {
                modulesMap.set(rawTitle, { title: rawTitle, order: order, videos: [] });
            }
            
            modulesMap.get(rawTitle).videos.push({
                ...lesson,
                previewThumb: lesson.thumbnail_url,
                videoFile: null, 
                thumbnailFile: null,
                likes: lesson.likes || 0,
                duration: lesson.duration || "Auto"
            });
        });

        return Array.from(modulesMap.values())
            .sort((a, b) => a.order - b.order)
            .map((mod, idx) => ({
                id: Date.now() + idx,
                title: mod.title,
                videos: mod.videos
            }));
    };

    const handleEditCourse = (course) => {
        setEditingCourseId(course.id);
        setCourseMeta({
            title: course.title,
            instructor: course.instructor,
            price: course.price,
            category: course.category,
            thumbnailFile: null
        });

        const organizedModules = groupLessonsIntoModules(course.lessons || []);
        setModules(organizedModules);
        setCurrentPage('add');
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) setCourseMeta({ ...courseMeta, thumbnailFile: file });
    };

    const addNewModule = () => {
        const newModule = {
            id: Date.now(),
            title: `Module ${modules.length + 1}`,
            videos: []
        };
        setModules([...modules, newModule]);
    };

    const openAddVideoModal = (moduleIndex) => {
        if (modules[moduleIndex].videos.length >= 10) {
            alert("Maximum 10 videos allowed per module.");
            return;
        }
        setActiveModuleIndex(moduleIndex);
        setEditingLessonId(null);
        setModalData({ title: '', description: '', content: '', requirements: '', videoFile: null, thumbnailFile: null, video_url: '', thumbnail_url: '', duration: '' });
        setIsModalOpen(true);
    };

    const openEditVideoModal = (moduleIndex, lesson) => {
        setActiveModuleIndex(moduleIndex);
        setEditingLessonId(lesson.id);
        setModalData({
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            requirements: lesson.requirements,
            videoFile: null,
            thumbnailFile: null,
            video_url: lesson.video_url || '',
            thumbnail_url: lesson.thumbnail_url || '',
            duration: lesson.duration || ''
        });
        setIsModalOpen(true);
    };

    const handleModalFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setModalData(prev => ({ ...prev, [type]: file }));

            if (type === 'videoFile') {
                try {
                    const durationSec = await getVideoDuration(file);
                    const formattedDuration = formatDurationHelper(durationSec);
                    setModalData(prev => ({ ...prev, duration: formattedDuration }));
                } catch (err) {
                    setModalData(prev => ({ ...prev, duration: 'Auto' }));
                }
            }
        }
    };

    const handleSaveVideoToModule = () => {
        if (!modalData.title) {
            alert("Video Title is required.");
            return;
        }

        const updatedModules = [...modules];
        const targetModule = updatedModules[activeModuleIndex];

        if (editingLessonId) {
            targetModule.videos = targetModule.videos.map(v => {
                if (v.id === editingLessonId) {
                    return {
                        ...v,
                        title: modalData.title,
                        description: modalData.description,
                        content: modalData.content,
                        requirements: modalData.requirements,
                        videoFile: modalData.videoFile || v.videoFile,
                        thumbnailFile: modalData.thumbnailFile || v.thumbnailFile,
                        previewThumb: modalData.thumbnailFile ? URL.createObjectURL(modalData.thumbnailFile) : v.previewThumb,
                        duration: modalData.duration || v.duration 
                    };
                }
                return v;
            });
        } else {
            if (!modalData.videoFile && !modalData.video_url) {
                 alert("Video File is required.");
                 return;
            }
            const newLesson = {
                id: Date.now(),
                title: modalData.title,
                description: modalData.description || "No description.",
                content: modalData.content || "No content provided.",
                requirements: modalData.requirements || "None.",
                videoFile: modalData.videoFile,
                thumbnailFile: modalData.thumbnailFile,
                previewThumb: modalData.thumbnailFile ? URL.createObjectURL(modalData.thumbnailFile) : null,
                isCompleted: false,
                isLocked: false,
                likes: 0,
                duration: modalData.duration || "Auto"
            };
            targetModule.videos.push(newLesson);
        }

        setModules(updatedModules);
        setIsModalOpen(false);
    };

    const removeVideoFromModule = (moduleIndex, videoId) => {
        const updatedModules = [...modules];
        updatedModules[moduleIndex].videos = updatedModules[moduleIndex].videos.filter(v => v.id !== videoId);
        setModules(updatedModules);
    };

    const handleSaveCourse = async () => {
        if (!courseMeta.title) {
            alert("Please enter a Course Title.");
            return;
        }

        setIsLoading(true);

        try {
            const courseFormData = new FormData();
            courseFormData.append('title', courseMeta.title);
            courseFormData.append('instructor', courseMeta.instructor || "Teacher");
            courseFormData.append('price', courseMeta.price || "0");
            courseFormData.append('category', courseMeta.category);
            if (courseMeta.thumbnailFile) {
                courseFormData.append('thumbnail', courseMeta.thumbnailFile);
            }

            let targetCourseId = editingCourseId;

            if (editingCourseId) {
                await fetch(`${API_BASE_URL}/${editingCourseId}`, { method: 'PUT', body: courseFormData });
            } else {
                const courseRes = await fetch(`${API_BASE_URL}/create`, { method: 'POST', body: courseFormData });
                const courseData = await courseRes.json();
                targetCourseId = courseData.id;
            }

            for (const [mIdx, module] of modules.entries()) {
                for (const lesson of module.videos) {
                    if (lesson.videoFile || lesson.thumbnailFile || (!lesson.id && !lesson.video_url)) {
                        const lessonFormData = new FormData();
                        lessonFormData.append('courseId', targetCourseId);
                        lessonFormData.append('moduleTitle', module.title); 
                        lessonFormData.append('moduleOrder', mIdx);       
                        lessonFormData.append('title', lesson.title);
                        lessonFormData.append('description', lesson.description);
                        lessonFormData.append('content', lesson.content);
                        lessonFormData.append('requirements', lesson.requirements);
                        lessonFormData.append('duration', lesson.duration); 

                        if (lesson.videoFile) lessonFormData.append('video', lesson.videoFile);
                        if (lesson.thumbnailFile) lessonFormData.append('thumbnail', lesson.thumbnailFile);

                        await fetch(`${API_BASE_URL}/create-lesson`, { method: 'POST', body: lessonFormData });
                    }
                }
            }

            alert(editingCourseId ? "✅ Course Updated Successfully!" : "✅ Course Created Successfully!");

            setCourseMeta({ title: '', instructor: '', price: '', thumbnailFile: null, category: 'Sales' });
            setModules([{ id: Date.now(), title: 'Module 1', videos: [] }]);
            setEditingCourseId(null);
            await fetchCourses();
            setCurrentPage('manage');

        } catch (error) {
            console.error(error);
            alert("Error saving course. Check console.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCourseClick = (course) => {
        let courseModules = [];
        if (course.lessons && course.lessons.length > 0) {
            const grouped = groupLessonsIntoModules(course.lessons);
            courseModules = grouped.map((mod, mIdx) => ({
                ...mod,
                videos: mod.videos.map((lesson, lIdx) => ({
                    ...lesson,
                    isCompleted: false,
                    isLocked: (mIdx === 0 && lIdx === 0) ? false : true 
                }))
            }));
        } else {
            courseModules = [{ title: 'Module 1', videos: [] }];
        }

        const completedFromDB = course.progress 
            ? course.progress.filter(p => p.assignment_completed).map(p => p.module_index)
            : [];
        
        setCompletedAssignments(completedFromDB);
        setSelectedCourse({ ...course, modules: courseModules });
        setActiveLessonIndex({ moduleIdx: 0, videoIdx: 0 });
        setCurrentPage('student_player');
        setIsPlaying(false);
        setPlaybackRate(1.0);
        setShowSettings(false);
        setVolume(1);
        setIsMuted(false);
        setComments([]); 
        setActiveReplyId(null);
        setNewRating(0);
    };

    const changeLesson = (mIdx, vIdx) => {
        if (selectedCourse.modules[mIdx].videos[vIdx].isLocked) return;
        setActiveLessonIndex({ moduleIdx: mIdx, videoIdx: vIdx });
        setIsPlaying(false);
        setPlaybackRate(1.0);
        setShowSettings(false);
        setNewCommentText('');
        setActiveReplyId(null);
        setNewRating(0);
    };

    const handleOpenAssignment = async (moduleIndex) => {
        if (!selectedCourse) return;
        
        try {
            await fetch(`${API_BASE_URL}/progress/assignment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: selectedCourse.id,
                    moduleIndex: moduleIndex
                })
            });

            if (!completedAssignments.includes(moduleIndex)) {
                setCompletedAssignments([...completedAssignments, moduleIndex]);
            }

            const nextModuleIdx = moduleIndex + 1;
            if (nextModuleIdx < selectedCourse.modules.length && selectedCourse.modules[nextModuleIdx].videos.length > 0) {
                const updatedModules = [...selectedCourse.modules];
                updatedModules[nextModuleIdx].videos[0].isLocked = false;
                setSelectedCourse({...selectedCourse, modules: updatedModules});
            }

        } catch (err) {
            console.error(err);
        }

        const downloadLink = `${API_DOWNLOAD_URL}/${selectedCourse.id}`;
        window.open(downloadLink, '_blank');
    };

    const handleLike = async () => {
        const { moduleIdx, videoIdx } = activeLessonIndex;
        const lesson = selectedCourse.modules[moduleIdx].videos[videoIdx];
        
        try {
            const res = await fetch(`${API_BASE_URL}/lesson/${lesson.id}/like`, { method: 'POST' });
            const data = await res.json();
            
            if (data.success) {
                const updatedModules = [...selectedCourse.modules];
                updatedModules[moduleIdx].videos[videoIdx].likes = data.likes;
                setSelectedCourse({ ...selectedCourse, modules: updatedModules });
            }
        } catch (err) { console.error(err); }
    };

    const handleShare = () => {
        const { moduleIdx, videoIdx } = activeLessonIndex;
        const lesson = selectedCourse.modules[moduleIdx].videos[videoIdx];
        const url = `${window.location.origin}/course/${selectedCourse.id}/video/${lesson.id}`;
        setShareUrl(url);
        setIsShareModalOpen(true);
        setIsCopied(false);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handlePostComment = async (parentId = null) => {
        const { moduleIdx, videoIdx } = activeLessonIndex;
        const lesson = selectedCourse.modules[moduleIdx].videos[videoIdx];
        const textToPost = parentId ? replyText : newCommentText;

        if (!textToPost.trim()) return;
        setIsPostingComment(true);

        try {
            const res = await fetch(`${API_COMMENTS_URL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    lessonId: lesson.id,
                    studentId: 1, 
                    text: textToPost,
                    parentId: parentId,
                    rating: parentId ? null : newRating 
                })
            });
            const data = await res.json();
            
            if (res.ok) {
                setComments([data, ...comments]); 
                
                if(!parentId && newRating > 0 && selectedCourse) {
                    setCourses(prevCourses => prevCourses.map(c => {
                        if(c.id === selectedCourse.id) {
                            const oldTotal = (parseFloat(c.avgRating || 0)) * (c.totalReviews || 0);
                            const newTotal = oldTotal + newRating;
                            const newCount = (c.totalReviews || 0) + 1;
                            return {
                                ...c,
                                avgRating: (newTotal / newCount).toFixed(1),
                                totalReviews: newCount
                            }
                        }
                        return c;
                    }));
                }

                if (parentId) {
                    setReplyText('');
                    setActiveReplyId(null);
                } else {
                    setNewCommentText('');
                    setNewRating(0);
                }
            }
        } catch (err) { 
            console.error(err); 
            alert("Failed to post comment");
        } finally {
            setIsPostingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`${API_COMMENTS_URL}/${commentId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                setComments(prevComments => prevComments.filter(c => c.id !== commentId));
            } else {
                alert("Failed to delete comment");
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Error deleting comment");
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
            setShowSettings(false);
        }
    };

    const handleVideoLoaded = () => {
        if(videoRef.current && selectedCourse) {
            const { moduleIdx, videoIdx } = activeLessonIndex;
            const lesson = selectedCourse.modules[moduleIdx].videos[videoIdx];
            
            const savedTime = localStorage.getItem(`vid_progress_${lesson.id}`);
            
            if (savedTime) {
                const timeToSeek = parseFloat(savedTime);
                videoRef.current.currentTime = timeToSeek;
                setCurrentTime(timeToSeek);
            } else {
                setCurrentTime(0);
                setProgress(0);
            }
        }
    }

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const curr = videoRef.current.currentTime;
            const dur = videoRef.current.duration;
            setCurrentTime(curr);
            setDuration(dur);
            setProgress((curr / dur) * 100);

            if(selectedCourse) {
                const { moduleIdx, videoIdx } = activeLessonIndex;
                const lesson = selectedCourse.modules[moduleIdx].videos[videoIdx];
                localStorage.setItem(`vid_progress_${lesson.id}`, curr);
            }
        }
    };

    const handleSeek = (e) => {
        if (videoRef.current) {
            const seekTo = (e.target.value / 100) * videoRef.current.duration;
            videoRef.current.currentTime = seekTo;
            setProgress(e.target.value);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const newMuted = !isMuted;
            videoRef.current.muted = newMuted;
            setIsMuted(newMuted);
            setVolume(newMuted ? 0 : 1);
            if (!newMuted) videoRef.current.volume = 1;
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
            videoRef.current.muted = newVolume === 0;
        }
    };

    const handleVideoEnded = () => {
        setIsPlaying(false);
        const { moduleIdx, videoIdx } = activeLessonIndex;
        const newModules = [...selectedCourse.modules];
        
        newModules[moduleIdx].videos[videoIdx].isCompleted = true;

        if (videoIdx + 1 < newModules[moduleIdx].videos.length) {
            newModules[moduleIdx].videos[videoIdx + 1].isLocked = false;
        } 
        
        setSelectedCourse({ ...selectedCourse, modules: newModules });
    };

    const toggleFullScreen = () => {
        if (playerContainerRef.current) {
            if (!document.fullscreenElement) {
                playerContainerRef.current.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    const changePlaybackSpeed = (rate) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
            setShowSettings(false);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const openPaymentModal = (course) => {
        setPaymentCourse(course);
        setPaymentSuccess(false);
        setShowPaymentModal(true);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessingPayment(true);

        setTimeout(async () => {
            try {
                const amount = parseFloat(paymentCourse.price);
                const response = await fetch('http://localhost:5000/api/courses/revenue/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount })
                });
                
                if (response.ok) {
                    setPaymentSuccess(true);
                    setTimeout(() => {
                        setShowPaymentModal(false);
                        setPaymentCourse(null);
                        setIsProcessingPayment(false);
                    }, 2000);
                }
            } catch (error) {
                console.error(error);
                setIsProcessingPayment(false);
            }
        }, 2000);
    };

    const renderAddPage = () => (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', fontFamily: '"Inter", sans-serif' }}>
            {isLoading && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 className="animate-spin" size={48} color="#2563eb" />
                    <h3 style={{ marginTop: '1rem', color: '#1e293b', fontWeight: 'bold' }}>{editingCourseId ? "Updating Course..." : "Uploading Course..."}</h3>
                    <p style={{ color: '#64748b' }}>Please wait, this may take a moment.</p>
                </div>
            )}

            <div style={{ backgroundColor: 'white', padding: '1.5rem 3rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => { setCurrentPage('manage'); setEditingCourseId(null); setCourseMeta({ title: '', instructor: '', price: '', thumbnailFile: null, category: 'Sales' }); setModules([{ id: Date.now(), title: 'Module 1', videos: [] }]); }} style={{ padding: '0.5rem', borderRadius: '50%', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>
                    <ArrowLeft size={20} color="#64748b" />
                </button>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>{editingCourseId ? "Edit Course Details" : "Create New Course"}</h1>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <LayoutGrid size={18} color="#2563eb" /> Course Overview
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#475569' }}>Course Title <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input type="text" value={courseMeta.title} onChange={e => setCourseMeta({ ...courseMeta, title: e.target.value })} placeholder="e.g. Master Sales Class" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#475569' }}>Instructor Name</label>
                                    <input type="text" value={courseMeta.instructor} onChange={e => setCourseMeta({ ...courseMeta, instructor: e.target.value })} placeholder="e.g. Andy Elliott" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#475569' }}>Category</label>
                                    <select value={courseMeta.category} onChange={e => setCourseMeta({ ...courseMeta, category: e.target.value })} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', backgroundColor: 'white', cursor: 'pointer' }}>
                                        <option value="Sales">Sales</option>
                                        <option value="CRM">CRM</option>
                                        <option value="Sales & CRM">Sales & CRM</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#475569' }}>Price (₹)</label>
                                    <input type="number" value={courseMeta.price} onChange={e => setCourseMeta({ ...courseMeta, price: e.target.value })} placeholder="e.g. 499" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} />
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Leave blank for Free.</p>
                                </div>
                            </div>
                        </div>

                        {modules.map((module, mIdx) => (
                            <div key={module.id} style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><List size={18} color="#2563eb" /> {module.title}</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Build your curriculum video by video.</p>
                                    </div>
                                    <div style={{ padding: '0.5rem 1rem', backgroundColor: module.videos.length === 10 ? '#fef2f2' : '#eff6ff', color: module.videos.length === 10 ? '#dc2626' : '#2563eb', borderRadius: '99px', fontWeight: 'bold', fontSize: '0.9rem' }}>{module.videos.length} / 10 Videos</div>
                                </div>
                                {module.videos.length === 0 ? (
                                    <div style={{ border: '2px dashed #e2e8f0', borderRadius: '0.75rem', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                        <Video size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                        <p>No videos added to this module.</p>
                                        <button onClick={() => openAddVideoModal(mIdx)} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', backgroundColor: 'white', color: '#2563eb', border: '2px solid #2563eb', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>+ Add Video</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {module.videos.map((video, index) => (
                                            <div key={video.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', backgroundColor: '#f8fafc' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '4rem', height: '2.5rem', borderRadius: '0.25rem', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                                                        <img src={video.previewThumb} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div>
                                                        <h4 style={{ fontWeight: '600', color: '#1e293b', fontSize: '1rem' }}>{index + 1}. {video.title}</h4>
                                                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                            {video.video_url ? 'Existing Video' : 'Ready to upload'} • 
                                                            <span style={{ fontWeight: 'bold', color: '#2563eb', marginLeft: '5px' }}>{video.duration || 'Auto'}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => openEditVideoModal(mIdx, video)} style={{ padding: '0.5rem', color: '#2563eb', background: 'white', border: '1px solid #dbeafe', borderRadius: '0.5rem', cursor: 'pointer' }}><Edit size={18} /></button>
                                                    <button onClick={() => removeVideoFromModule(mIdx, video.id)} style={{ padding: '0.5rem', color: '#ef4444', background: 'white', border: '1px solid #fee2e2', borderRadius: '0.5rem', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                                </div>
                                            </div>
                                        ))}
                                        {module.videos.length < 10 && (
                                            <button onClick={() => openAddVideoModal(mIdx)} style={{ width: '100%', padding: '1rem', border: '2px dashed #cbd5e1', borderRadius: '0.75rem', color: '#64748b', fontWeight: '600', background: 'transparent', cursor: 'pointer', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Plus size={18} /> Add Video</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        <button onClick={addNewModule} style={{ width: '100%', padding: '1.25rem', backgroundColor: 'white', color: '#2563eb', border: '2px dashed #2563eb', borderRadius: '1rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                            <Plus size={22} /> Add New Module
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                            <label style={{ fontWeight: '600', marginBottom: '1rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ImageIcon size={18} color="#ec4899" /> Course Thumbnail</label>
                            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '0.75rem', padding: '2rem 1rem', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
                                <input type="file" accept="image/*" id="img-upload" style={{ display: 'none' }} onChange={handleThumbnailUpload} />
                                <label htmlFor="img-upload" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                                    <div style={{ width: '3rem', height: '3rem', backgroundColor: '#fce7f3', color: '#ec4899', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}><Upload size={20} /></div>
                                    {courseMeta.thumbnailFile ? <p style={{ fontWeight: '600', color: '#1e293b' }}>{courseMeta.thumbnailFile.name}</p> : <p style={{ color: '#475569' }}>{editingCourseId ? "Change Image" : "Upload Image"}</p>}
                                </label>
                            </div>
                        </div>
                        <button onClick={handleSaveCourse} disabled={isLoading} style={{ width: '100%', padding: '1rem', backgroundColor: isLoading ? '#94a3b8' : '#2563eb', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 'bold', fontSize: '1rem', cursor: isLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)' }}>
                            {isLoading ? 'Processing...' : (editingCourseId ? 'Update Course' : 'Save Full Course')}
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(2px)' }}>
                    <div style={{ backgroundColor: 'white', width: '650px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '1rem', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>{editingLessonId ? 'Edit Video Lesson' : 'Add Video Lesson'}</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div><label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Video Title *</label><input type="text" value={modalData.title} onChange={e => setModalData({ ...modalData, title: e.target.value })} placeholder="Lesson title..." style={{ width: '100%', padding: '0.875rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none' }} /></div>

                            <div><label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Description</label><textarea value={modalData.description} onChange={e => setModalData({ ...modalData, description: e.target.value })} placeholder="Video description..." rows={2} style={{ width: '100%', padding: '0.875rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none' }} /></div>

                            <div><label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Content Points</label><textarea value={modalData.content} onChange={e => setModalData({ ...modalData, content: e.target.value })} placeholder="Key topics..." rows={2} style={{ width: '100%', padding: '0.875rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none' }} /></div>

                            <div><label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Requirements</label><input type="text" value={modalData.requirements} onChange={e => setModalData({ ...modalData, requirements: e.target.value })} placeholder="Prerequisites..." style={{ width: '100%', padding: '0.875rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none' }} /></div>

                            <div>
                                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.4rem' }}>
                                    <Clock size={16} /> Duration (e.g. 10:05)
                                </label>
                                <input 
                                    type="text" 
                                    value={modalData.duration} 
                                    onChange={e => setModalData({ ...modalData, duration: e.target.value })} 
                                    placeholder="Auto-calculated or type manually..." 
                                    style={{ width: '100%', padding: '0.875rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', outline: 'none' }} 
                                />
                                {modalData.duration === 'Auto' && <p style={{fontSize: '0.8rem', color: '#f59e0b', marginTop: '4px'}}>* Could not detect time automatically. Please type it in.</p>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Video File</label>
                                    <div style={{ border: '2px dashed #cbd5e1', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
                                        <input type="file" accept="video/*" id="modal-vid-upload" style={{ display: 'none' }} onChange={(e) => handleModalFileUpload(e, 'videoFile')} />
                                        <label htmlFor="modal-vid-upload" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                                            <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#dbeafe', color: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}><Upload size={18} /></div>
                                            {modalData.videoFile ? <p style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.8rem' }}>{modalData.videoFile.name}</p> : <p style={{ fontWeight: '500', color: '#475569', fontSize: '0.8rem' }}>{modalData.video_url ? 'Change Video' : 'Upload Video'}</p>}
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Lesson Thumbnail</label>
                                    <div style={{ border: '2px dashed #cbd5e1', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
                                        <input type="file" accept="image/*" id="modal-thumb-upload" style={{ display: 'none' }} onChange={(e) => handleModalFileUpload(e, 'thumbnailFile')} />
                                        <label htmlFor="modal-thumb-upload" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                                            <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#fce7f3', color: '#ec4899', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}><ImageIcon size={18} /></div>
                                            {modalData.thumbnailFile ? <p style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.8rem' }}>{modalData.thumbnailFile.name}</p> : <p style={{ fontWeight: '500', color: '#475569', fontSize: '0.8rem' }}>{modalData.thumbnail_url ? 'Change Image' : 'Upload Image'}</p>}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleSaveVideoToModule} style={{ marginTop: '1rem', width: '100%', padding: '1rem', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
                                {editingLessonId ? 'Update Lesson' : 'Add Video to Module'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderStudentPlayer = () => {
        if (!selectedCourse) return null;
        
        const hasModules = selectedCourse.modules && selectedCourse.modules.length > 0;
        const { moduleIdx, videoIdx } = activeLessonIndex;
        
        let activeLesson = null;
        if (hasModules && selectedCourse.modules[moduleIdx] && selectedCourse.modules[moduleIdx].videos[videoIdx]) {
            activeLesson = selectedCourse.modules[moduleIdx].videos[videoIdx];
        }

        let totalVideos = 0;
        let completedVideos = 0;
        let currentModuleVideos = 0;
        let currentModuleCompleted = 0;

        if (hasModules) {
            selectedCourse.modules.forEach((m, idx) => {
                totalVideos += m.videos.length;
                completedVideos += m.videos.filter(l => l.isCompleted).length;
                if (idx === moduleIdx) {
                    currentModuleVideos = m.videos.length;
                    currentModuleCompleted = m.videos.filter(l => l.isCompleted).length;
                }
            });
        }
        
        const progressPercentage = totalVideos === 0 ? 0 : (completedVideos / totalVideos) * 100;
        const isModuleVideosComplete = currentModuleVideos > 0 && currentModuleVideos === currentModuleCompleted;
        
        const rootComments = comments
            .filter(c => c.parent_id === null || c.parent_id === 0)
            .sort((a,b) => {
                if(sortOrder === 'newest') return new Date(b.created_at) - new Date(a.created_at);
                if(sortOrder === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
                return 0;
            });

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
                <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', height: '60px', display: 'flex', alignItems: 'center', padding: '0 2rem', justifyContent: 'space-between', flexShrink: 0, zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => setCurrentPage('manage')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><ArrowLeft size={20} color="#374151" /></button>
                        <h1 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#111827' }}>{selectedCourse.title}</h1>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={18} /> {selectedCourse.instructor}
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                    <div style={{ width: '75%', overflowY: 'auto' }}>
                        <div style={{ padding: '2rem' }}>
                            {activeLesson ? (
                                <div
                                    ref={playerContainerRef}
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'black',
                                        aspectRatio: '16/9',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        borderRadius: '1.5rem',
                                        overflow: 'hidden',
                                        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)'
                                    }}
                                    onMouseEnter={() => setIsHoveringPlayer(true)}
                                    onMouseLeave={() => setIsHoveringPlayer(false)}
                                >
                                    <video
                                        key={activeLesson.id}
                                        ref={videoRef}
                                        src={activeLesson.video_url}
                                        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
                                        onLoadedMetadata={handleVideoLoaded}
                                        onTimeUpdate={handleTimeUpdate}
                                        onEnded={handleVideoEnded}
                                        onClick={togglePlay}
                                    />
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                                        {!isPlaying && (
                                            <div
                                                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    pointerEvents: 'auto',
                                                    cursor: 'pointer',
                                                    backdropFilter: 'blur(2px)',
                                                    border: '3px solid rgba(255,255,255,0.2)'
                                                }}>
                                                <Play size={48} fill="white" color="white" style={{ marginLeft: '6px' }} />
                                            </div>
                                        )}
                                    </div>
                                    {showSettings && (
                                        <div style={{ position: 'absolute', bottom: '80px', right: '20px', backgroundColor: 'rgba(28, 28, 28, 0.95)', borderRadius: '12px', padding: '15px', zIndex: 20, minWidth: '220px' }}>
                                            <div style={{ color: 'white', fontSize: '1.1rem', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px', fontWeight: 'bold' }}>Playback Speed</div>
                                            {[0.5, 1.0, 1.25, 1.5, 2.0].map(rate => (
                                                <div
                                                    key={rate}
                                                    onClick={() => changePlaybackSpeed(rate)}
                                                    style={{ color: playbackRate === rate ? '#3b82f6' : 'white', padding: '12px 14px', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '6px', backgroundColor: playbackRate === rate ? 'rgba(59, 130, 246, 0.15)' : 'transparent' }}
                                                >
                                                    <span>{rate}x {rate === 1.0 && '(Normal)'}</span>
                                                    {playbackRate === rate && <Check size={20} />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: '0 25px 25px 25px',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
                                        opacity: (isPlaying && !isHoveringPlayer) ? 0 : 1,
                                        transition: 'opacity 0.3s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end'
                                    }}>
                                        <div style={{ position: 'relative', height: '8px', width: '100%', backgroundColor: 'rgba(255,255,255,0.3)', cursor: 'pointer', marginBottom: '20px', borderRadius: '4px' }}>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={progress}
                                                onChange={handleSeek}
                                                style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 5, margin: 0 }}
                                            />
                                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, backgroundColor: '#ef4444', pointerEvents: 'none', borderRadius: '4px' }}></div>
                                            <div style={{ position: 'absolute', left: `${progress}%`, top: '50%', width: '18px', height: '18px', backgroundColor: '#ef4444', borderRadius: '50%', transform: 'translate(-50%, -50%)', opacity: isHoveringPlayer ? 1 : 0, transition: 'opacity 0.2s' }}></div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                                <button onClick={togglePlay} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
                                                    {isPlaying ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" />}
                                                </button>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <button onClick={toggleMute} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
                                                        {isMuted || volume === 0 ? <VolumeX size={32} /> : volume < 0.5 ? <Volume1 size={32} /> : <Volume2 size={32} />}
                                                    </button>
                                                    <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolumeChange} style={{ width: '120px', cursor: 'pointer', accentColor: 'white', height: '6px' }} />
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.2rem', fontWeight: '600' }}>
                                                    <span>{formatTime(currentTime)}</span>
                                                    <span style={{ opacity: 0.6 }}>/</span>
                                                    <span style={{ opacity: 0.8 }}>{formatTime(duration)}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                <button onClick={toggleSettings} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}><Settings size={32} /></button>
                                                <button onClick={toggleFullScreen} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}><Maximize size={32} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ height: '400px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                    <Video size={64} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                                    <h3>No Content Selected</h3>
                                    <p>Select a video from the sidebar to start watching.</p>
                                </div>
                            )}
                        </div>

                        {activeLesson && (
                            <div style={{ padding: '0 2.5rem 2.5rem 2.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div style={{ maxWidth: '80%' }}>
                                        <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem', lineHeight: 1.2 }}>{activeLesson.title}</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><User size={24} /></div>
                                            <span style={{ fontWeight: '600', fontSize: '1.1rem', color: '#334155' }}>{selectedCourse.instructor}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button 
                                            onClick={handleLike}
                                            style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#eff6ff', border: '1px solid #dbeafe', color: '#2563eb', padding: '10px 20px', borderRadius: '30px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}
                                        >
                                            <ThumbsUp size={20} /> 
                                            Like 
                                            <span style={{background: '#bfdbfe', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem'}}>{activeLesson.likes || 0}</span>
                                        </button>
                                        <button onClick={handleShare} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155', padding: '10px 20px', borderRadius: '30px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}><Share2 size={20} /> Share</button>
                                    </div>
                                </div>

                                <div style={{ marginTop: '3rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {comments.length} Reviews
                                        </h3>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748b' }}>Sort by:</span>
                                            <select 
                                                value={sortOrder}
                                                onChange={(e) => setSortOrder(e.target.value)}
                                                style={{ border: 'none', background: 'transparent', fontWeight: 'bold', cursor: 'pointer', outline: 'none', fontSize: '0.95rem', color: '#334155' }}
                                            >
                                                <option value="newest">Newest First</option>
                                                <option value="oldest">Oldest First</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem', flexShrink: 0 }}>
                                            S
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        size={24}
                                                        fill={star <= newRating ? "#eab308" : "none"}
                                                        color={star <= newRating ? "#eab308" : "#cbd5e1"}
                                                        onClick={() => setNewRating(star)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                ))}
                                            </div>
                                            <input 
                                                type="text" 
                                                value={newCommentText}
                                                onChange={(e) => setNewCommentText(e.target.value)}
                                                placeholder="Write a review..."
                                                style={{ width: '100%', border: 'none', borderBottom: '1px solid #e2e8f0', padding: '0.5rem 0', outline: 'none', fontSize: '1rem', backgroundColor: 'transparent' }}
                                                onFocus={(e) => e.target.style.borderBottom = '2px solid #0f172a'}
                                                onBlur={(e) => e.target.style.borderBottom = '1px solid #e2e8f0'}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
                                                <button 
                                                    onClick={() => { setNewCommentText(''); setNewRating(0); }}
                                                    style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: 'none', background: 'transparent', fontWeight: '600', cursor: 'pointer', color: '#64748b' }}>
                                                    Cancel
                                                </button>
                                                <button 
                                                    onClick={() => handlePostComment(null)} 
                                                    disabled={!newCommentText.trim() || isPostingComment}
                                                    style={{ 
                                                        padding: '0.5rem 1rem', 
                                                        borderRadius: '20px', 
                                                        border: 'none', 
                                                        background: newCommentText.trim() ? '#3b82f6' : '#e2e8f0', 
                                                        color: newCommentText.trim() ? 'white' : '#94a3b8', 
                                                        fontWeight: '600', 
                                                        cursor: newCommentText.trim() ? 'pointer' : 'default' 
                                                    }}>
                                                    {isPostingComment ? 'Posting...' : 'Post Review'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        {rootComments.map((comment) => (
                                            <CommentItem 
                                                key={comment.id} 
                                                comment={comment} 
                                                allComments={comments}
                                                activeReplyId={activeReplyId}
                                                setActiveReplyId={setActiveReplyId}
                                                replyText={replyText}
                                                setReplyText={setReplyText}
                                                onPostReply={handlePostComment}
                                                onDelete={handleDeleteComment}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ width: '25%', backgroundColor: 'white', borderLeft: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827', marginBottom: '1rem' }}>Course Content</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem', color: '#64748b' }}>
                                <span style={{ fontWeight: '700', color: '#2563eb' }}>{Math.round(progressPercentage)}% Completed</span>
                                <span>{completedVideos}/{totalVideos}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                                <div style={{ width: `${progressPercentage}%`, height: '100%', backgroundColor: '#2563eb', transition: 'width 0.5s ease' }}></div>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
                            {selectedCourse.modules.map((mod, mIdx) => {
                                const isModuleLocked = mIdx > 0 && !completedAssignments.includes(mIdx - 1);
                                
                                return (
                                <div key={mIdx} style={{ marginBottom: '1.5rem', opacity: isModuleLocked ? 0.5 : 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        {mod.title}
                                        {isModuleLocked && <Lock size={14} />}
                                    </div>
                                    {mod.videos.map((lesson, vIdx) => {
                                        const isActive = mIdx === moduleIdx && vIdx === videoIdx;
                                        
                                        let isLocked = false;
                                        if (isModuleLocked) {
                                            isLocked = true;
                                        } else {
                                            if (vIdx === 0) {
                                                isLocked = false;
                                            } else {
                                                isLocked = !mod.videos[vIdx - 1].isCompleted;
                                            }
                                        }

                                        const isCompleted = lesson.isCompleted;

                                        return (
                                            <div key={lesson.id} onClick={() => !isLocked && changeLesson(mIdx, vIdx)} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '1rem', cursor: isLocked ? 'not-allowed' : 'pointer', backgroundColor: isActive ? '#eff6ff' : 'transparent', border: isActive ? '1px solid #bfdbfe' : '1px solid transparent', opacity: isLocked ? 0.6 : 1, borderRadius: '1rem', marginBottom: '12px', transition: 'all 0.2s' }}>
                                                <div style={{ width: '100px', height: '65px', borderRadius: '0.75rem', overflow: 'hidden', flexShrink: 0, backgroundColor: '#cbd5e1', position: 'relative' }}>
                                                    {lesson.previewThumb || lesson.thumbnail_url ? <img src={lesson.previewThumb || lesson.thumbnail_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="lesson" /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={24} /></div>}
                                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {isLocked ? (
                                                            <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Lock size={20} color="white" />
                                                            </div>
                                                        ) : (
                                                            <div style={{ width: '24px', height: '24px', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Play size={12} fill="white" color="white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isCompleted && <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'white', padding: '2px', borderRadius: '0 0 0 8px' }}><CheckCircle size={16} fill="#22c55e" color="white" /></div>}
                                                </div>

                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{vIdx + 1}. {lesson.title}</h4>
                                                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{selectedCourse.instructor}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    
                                    {!isModuleLocked && (
                                        <div style={{ padding: '0.5rem 0' }}>
                                            <button 
                                                disabled={!isModuleVideosComplete} 
                                                onClick={() => handleOpenAssignment(mIdx)} 
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: 'none', backgroundColor: isModuleVideosComplete ? '#4f46e5' : '#e2e8f0', color: isModuleVideosComplete ? 'white' : '#94a3b8', cursor: isModuleVideosComplete ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: isModuleVideosComplete ? '0 4px 6px -1px rgba(79, 70, 229, 0.4)' : 'none', transition: 'all 0.2s' }}
                                            >
                                                {completedAssignments.includes(mIdx) ? 
                                                    <><Check size={18} /> Assignment Completed</> : 
                                                    (isModuleVideosComplete ? <><ExternalLink size={18} /> Open Assignment</> : <><Lock size={18} /> Assignment Locked</>)
                                                }
                                            </button>
                                        </div>
                                    )}
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {isShareModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setIsShareModalOpen(false)}>
                        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>Share this lesson</h3>
                                <button onClick={() => setIsShareModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', color: '#64748b' }}><X size={24} /></button>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                                <a href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#334155' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}><MessageSquare size={24} /></div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>WhatsApp</span>
                                </a>

                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#334155' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8' }}><Facebook size={24} /></div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Facebook</span>
                                </a>

                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#334155' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}><Twitter size={24} /></div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Twitter</span>
                                </a>

                                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#334155' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a66c2' }}><Linkedin size={24} /></div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>LinkedIn</span>
                                </a>

                                <a href={`mailto:?body=${encodeURIComponent(shareUrl)}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#334155' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><Mail size={24} /></div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Email</span>
                                </a>
                            </div>

                            <div style={{ position: 'relative' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem', display: 'block' }}>Copy Link</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ padding: '0.75rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRight: 'none', borderRadius: '0.5rem 0 0 0.5rem', color: '#64748b' }}>
                                        <LinkIcon size={18} />
                                    </div>
                                    <input readOnly value={shareUrl} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'white', border: '1px solid #cbd5e1', borderLeft: 'none', color: '#475569', fontSize: '0.95rem', outline: 'none' }} />
                                    <button onClick={handleCopyLink} style={{ padding: '0.75rem 1.5rem', backgroundColor: isCopied ? '#22c55e' : '#0f172a', border: '1px solid', borderColor: isCopied ? '#22c55e' : '#0f172a', borderRadius: '0 0.5rem 0.5rem 0', color: 'white', fontWeight: '600', cursor: 'pointer', minWidth: '100px', transition: 'all 0.2s' }}>
                                        {isCopied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showPaymentModal && paymentCourse && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '1rem', width: '100%', maxWidth: '400px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                            <div style={{ background: 'linear-gradient(to right, #0f172a, #1e293b)', padding: '1.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)', padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid rgba(249, 115, 22, 0.5)' }}>
                                        <span style={{ fontWeight: 'bold', color: '#f97316', letterSpacing: '0.05em' }}>RuPay</span>
                                    </div>
                                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>Secure Payment</span>
                                </div>
                                <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ padding: '1.5rem' }}>
                                {!paymentSuccess ? (
                                    <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '0.5rem' }}>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.25rem' }}>Paying for</p>
                                            <h3 style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{paymentCourse.title}</h3>
                                            <p style={{ color: '#059669', fontWeight: 'bold', fontSize: '1.25rem' }}>₹{paymentCourse.price}</p>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>Card Number</label>
                                            <div style={{ position: 'relative' }}>
                                                <CreditCard size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                                <input required type="text" placeholder="0000 0000 0000 0000" style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '1px solid #cbd5e1', borderRadius: '0.75rem', fontSize: '1rem', outline: 'none' }} />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>Expiry</label>
                                                <input required type="text" placeholder="MM/YY" style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.75rem', fontSize: '1rem', outline: 'none' }} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>CVV</label>
                                                <input required type="password" placeholder="123" maxLength="3" style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.75rem', fontSize: '1rem', outline: 'none' }} />
                                            </div>
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={isProcessingPayment}
                                            style={{ marginTop: '1rem', width: '100%', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', padding: '0.9rem', borderRadius: '0.75rem', border: 'none', cursor: isProcessingPayment ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)' }}
                                        >
                                            {isProcessingPayment ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : `Pay ₹${paymentCourse.price}`}
                                        </button>
                                    </form>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0', textAlign: 'center' }}>
                                        <div style={{ width: '80px', height: '80px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                            <CheckCircle size={40} color="#16a34a" />
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Payment Successful!</h3>
                                        <p style={{ color: '#64748b' }}>Revenue has been updated.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderManagePage = () => (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', fontFamily: '"Inter", sans-serif' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem 3rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <BookOpen style={{ width: '2.5rem', height: '2.5rem', color: '#1e293b' }} />
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a' }}>Manage Courses</h1>
                </div>
                <button onClick={() => { setCurrentPage('add'); setEditingCourseId(null); setCourseMeta({ title: '', instructor: '', price: '', thumbnailFile: null, category: 'Sales' }); setModules([{ id: Date.now(), title: 'Module 1', videos: [] }]); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 2rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '99px', border: 'none', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)' }}>
                    <Plus size={20} /> New Course
                </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '3rem' }}>
                <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' }}>
                    {courses.length === 0 ? <p>No courses found. Add one!</p> : courses.map((course) => (
                        <div key={course.id} onClick={() => handleCourseClick(course)} style={{ backgroundColor: 'white', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ height: '240px', width: '100%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                {course.thumbnail_url ? <img src={course.thumbnail_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Course" /> : <div style={{ width: '100%', height: '100%', backgroundColor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={48} color="white" /></div>}
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                                    <div style={{ width: '70px', height: '70px', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                                        <Play size={36} fill="white" color="white" style={{ marginLeft: '4px' }} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>{course.title}</h3>
                                <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <User size={16} /> {course.instructor}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#eab308', fontWeight: 'bold', fontSize: '1rem' }}>
                                        {parseFloat(course.avgRating) > 0 ? (
                                            <>
                                                <span style={{ fontSize: '1.1rem' }}>{course.avgRating}</span>
                                                <Star size={18} fill="#eab308" />
                                                <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>({course.totalReviews})</span>
                                            </>
                                        ) : (
                                            <span style={{ fontSize: '0.9rem', color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>New</span>
                                        )}
                                    </div>
                                    <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.5rem' }}>
                                        {course.price && course.price !== "0" ? `₹${course.price}` : 'Free'}
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); openPaymentModal(course); }}
                                    style={{ flex: 1.5, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#10b981', color: 'white', border: '1px solid #059669', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem', transition: 'background-color 0.2s' }}
                                >
                                    Buy Now
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEditCourse(course); }}
                                    style={{ flex: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem', transition: 'background-color 0.2s' }}
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }}
                                    style={{ flex: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem', transition: 'background-color 0.2s' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', backgroundColor: '#f8fafc' }}>
            <div style={{ flex: 1, overflowY: 'hidden' }}>
                {currentPage === 'add' ? renderAddPage() :
                    currentPage === 'student_player' ? renderStudentPlayer() :
                        renderManagePage()}
            </div>
        </div>
    );
};

export default Courses;