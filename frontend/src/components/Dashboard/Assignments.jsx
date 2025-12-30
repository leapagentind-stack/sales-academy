import React, { useState, useEffect } from 'react';
import { 
    FileText, 
    Plus, 
    Trash2, 
    Upload, 
    ArrowLeft, 
    Check, 
    Loader2, 
    Pencil, 
    Calendar,
    X,
    LayoutGrid,
    List as ListIcon
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/assignments';
const API_COURSES_URL = 'http://localhost:5000/api/courses';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [availableModules, setAvailableModules] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [activeModuleIndex, setActiveModuleIndex] = useState(0);
    
    const [formData, setFormData] = useState({
        title: '',
        file: null,
        existingFileName: ''
    });

    const fetchAssignments = async () => {
        try {
            const res = await fetch(API_BASE_URL);
            const data = await res.json();
            setAssignments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setAssignments([]);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await fetch(API_COURSES_URL);
            const data = await res.json();
            setCourses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setCourses([]);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchAssignments();
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            const course = courses.find(c => c.id.toString() === selectedCourseId.toString());
            if (course && course.lessons && course.lessons.length > 0) {
                const uniqueModules = [...new Set(course.lessons.map(l => l.module_title || l.moduleTitle))];
                setAvailableModules(uniqueModules);
            } else {
                setAvailableModules(['Module 1']); 
            }
        } else {
            setAvailableModules([]);
        }
    }, [selectedCourseId, courses]);

    const handleOpenCreate = (moduleIndex) => {
        setEditingId(null);
        setActiveModuleIndex(moduleIndex);
        setFormData({ title: '', file: null, existingFileName: '' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item) => {
        setEditingId(item.id);
        setActiveModuleIndex(item.module_index);
        setFormData({
            title: item.title,
            file: null,
            existingFileName: item.file_name || item.file_path
        });
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] });
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !selectedCourseId) {
            alert("Please fill in course and title.");
            return;
        }
        if (!editingId && !formData.file) {
            alert("Please upload a file.");
            return;
        }

        setIsSubmitting(true);

        const data = new FormData();
        data.append('course_id', selectedCourseId);
        data.append('module_index', activeModuleIndex);
        data.append('title', formData.title);
        if (formData.file) {
            data.append('assignment_file', formData.file);
        }

        try {
            const url = editingId 
                ? `${API_BASE_URL}/${editingId}`
                : `${API_BASE_URL}/submit`;
            
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: data
            });

            const result = await response.json();

            if (result.success) {
                alert(editingId ? "✅ Assignment Updated!" : "✅ Assignment Created!");
                fetchAssignments(); 
                setIsModalOpen(false);
            } else {
                alert("Failed: " + result.message);
            }
        } catch (error) {
            console.error(error);
            alert("Operation failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this assignment?")) {
            try {
                await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
                fetchAssignments();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const styles = {
        container: { height: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', fontFamily: '"Inter", sans-serif' },
        header: { backgroundColor: 'white', padding: '1.5rem 3rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' },
        title: { fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' },
        content: { flex: 1, overflowY: 'auto', padding: '2rem 3rem' },
        moduleCard: { backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '2rem' },
        moduleHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        moduleTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        itemCard: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', backgroundColor: '#f8fafc', marginBottom: '1rem' },
        addBtn: { width: '100%', padding: '1rem', border: '2px dashed #cbd5e1', borderRadius: '0.75rem', color: '#64748b', fontWeight: '600', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
        selectInput: { width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', backgroundColor: 'white', marginBottom: '2rem' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <FileText size={28} color="#2563eb" />
                <h1 style={styles.title}>Manage Assignments</h1>
            </div>

            <div style={styles.content}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', marginBottom: '1rem' }}>Select Course</h3>
                        <select 
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            style={styles.selectInput}
                        >
                            <option value="">-- Choose a Course to Manage --</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>

                    {selectedCourseId ? (
                        availableModules.map((modTitle, idx) => {
                            const moduleAssignments = assignments.filter(a => 
                                a.course_id.toString() === selectedCourseId.toString() && 
                                (a.module_index === idx)
                            );

                            return (
                                <div key={idx} style={styles.moduleCard}>
                                    <div style={styles.moduleHeader}>
                                        <h3 style={styles.moduleTitle}>
                                            <ListIcon size={18} color="#2563eb" /> 
                                            {modTitle} <span style={{fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal'}}>(Module {idx + 1})</span>
                                        </h3>
                                        <div style={{ padding: '0.25rem 0.75rem', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '600' }}>
                                            {moduleAssignments.length} Assignments
                                        </div>
                                    </div>

                                    {moduleAssignments.length > 0 ? (
                                        moduleAssignments.map((item) => (
                                            <div key={item.id} style={styles.itemCard}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{item.title}</h4>
                                                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                            {item.file_path.split('/').pop()} • {item.created_at ? item.created_at.split('T')[0] : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => handleOpenEdit(item)} style={{ padding: '0.5rem', color: '#2563eb', background: 'white', border: '1px solid #dbeafe', borderRadius: '0.5rem', cursor: 'pointer' }}><Pencil size={16} /></button>
                                                    <button onClick={() => handleDelete(item.id)} style={{ padding: '0.5rem', color: '#ef4444', background: 'white', border: '1px solid #fee2e2', borderRadius: '0.5rem', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '1rem', fontStyle: 'italic' }}>No assignments in this module.</p>
                                    )}

                                    <button onClick={() => handleOpenCreate(idx)} style={styles.addBtn}>
                                        <Plus size={18} /> Add Assignment
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                            <LayoutGrid size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
                            <p>Select a course above to view and add assignments.</p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(2px)' }}>
                    <div style={{ backgroundColor: 'white', width: '500px', borderRadius: '1rem', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>
                                {editingId ? 'Edit Assignment' : 'Upload Assignment'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', color: '#0369a1', fontSize: '0.9rem', fontWeight: '500' }}>
                                Adding to: {availableModules[activeModuleIndex] || `Module ${activeModuleIndex + 1}`}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem' }}>Assignment Title</label>
                                <input 
                                    type="text" 
                                    value={formData.title} 
                                    onChange={e => setFormData({...formData, title: e.target.value})} 
                                    placeholder="e.g. Weekly Report" 
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} 
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem' }}>File</label>
                                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
                                    <input type="file" id="modal-file" style={{ display: 'none' }} onChange={handleFileChange} />
                                    <label htmlFor="modal-file" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                                        <div style={{ width: '3rem', height: '3rem', backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}><Upload size={20} /></div>
                                        {formData.file ? (
                                            <p style={{ fontWeight: '600', color: '#16a34a' }}>{formData.file.name}</p>
                                        ) : (
                                            formData.existingFileName ? (
                                                <p style={{ fontWeight: '600', color: '#475569' }}>Current: {formData.existingFileName.split('/').pop()}</p>
                                            ) : (
                                                <p style={{ color: '#64748b' }}>Click to upload PDF/DOCX</p>
                                            )
                                        )}
                                    </label>
                                </div>
                            </div>

                            <button onClick={handleSubmit} disabled={isSubmitting} style={{ marginTop: '1rem', width: '100%', padding: '1rem', backgroundColor: isSubmitting ? '#93c5fd' : '#2563eb', color: 'white', fontWeight: 'bold', borderRadius: '0.5rem', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                                {editingId ? 'Update Assignment' : 'Upload Assignment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assignments;