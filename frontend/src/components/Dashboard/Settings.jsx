import React, { useState, useEffect } from 'react';
import { 
    User, Mail, Bell, Lock, Camera, Save, 
    CheckCircle, AlertCircle, Loader2, Shield, 
    Smartphone 
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/settings';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        bio: '',
        avatar_url: '',
        notify_email: false,
        notify_sms: false
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setProfile(data);
            if (data.avatar_url) setPreviewUrl(data.avatar_url);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const saveProfile = async () => {
        setIsSaving(true);
        setMessage({ type: '', text: '' });
        
        try {
            const formData = new FormData();
            formData.append('name', profile.name);
            formData.append('email', profile.email);
            formData.append('bio', profile.bio);
            if (avatarFile) formData.append('avatar', avatarFile);

            const res = await fetch(`${API_URL}/profile`, {
                method: 'PUT',
                body: formData
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error saving changes.' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const saveNotifications = async () => {
        setIsSaving(true);
        try {
            await fetch(`${API_URL}/notifications`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notifyEmail: profile.notify_email,
                    notifySms: profile.notify_sms
                })
            });
            setMessage({ type: 'success', text: 'Preferences saved.' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save.' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const changePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        setIsSaving(true);
        try {
            const res = await fetch(`${API_URL}/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: 'Password changed successfully.' });
                setPasswords({ current: '', new: '', confirm: '' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to change password.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Server error.' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={32} color="#2563eb" />
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '2rem' }}>Settings</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {[
                            { id: 'profile', label: 'Public Profile', icon: User },
                            { id: 'security', label: 'Security', icon: Shield },
                            { id: 'notifications', label: 'Notifications', icon: Bell },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                                    color: activeTab === tab.id ? '#2563eb' : '#64748b',
                                    fontWeight: activeTab === tab.id ? '600' : '500',
                                    boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', minHeight: '500px' }}>
                        
                        {message.text && (
                            <div style={{ 
                                padding: '12px 16px', 
                                borderRadius: '8px', 
                                marginBottom: '2rem', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                                color: message.type === 'success' ? '#059669' : '#dc2626',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}>
                                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                {message.text}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>Profile Information</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Update your photo and personal details.</p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
                                    <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '4px solid #f8fafc', boxShadow: '0 0 0 1px #e2e8f0' }}>
                                            {previewUrl ? 
                                                <img src={previewUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 
                                                <div style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><User size={40} /></div>
                                            }
                                        </div>
                                        <label htmlFor="avatar-upload" style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: '#2563eb', color: 'white', padding: '6px', borderRadius: '50%', cursor: 'pointer', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Camera size={14} />
                                        </label>
                                        <input type="file" id="avatar-upload" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: '600', color: '#1e293b' }}>Profile Photo</h4>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Recommended dimensions 400x400px.</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>Full Name</label>
                                        <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>Email Address</label>
                                        <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>Bio</label>
                                        <textarea rows={4} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Tell us a little about yourself..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                                    <button onClick={saveProfile} disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>Password & Security</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage your password to keep your account safe.</p>
                                </div>

                                <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>Current Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: '#94a3b8' }} />
                                                <input type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>New Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: '#94a3b8' }} />
                                                <input type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>Confirm New Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: '#94a3b8' }} />
                                                <input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                                    <button onClick={changePassword} disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Update Password
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>Notification Preferences</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Choose how you want to be notified.</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '10px', backgroundColor: '#e0f2fe', borderRadius: '50%', color: '#0ea5e9' }}><Mail size={20} /></div>
                                            <div>
                                                <h4 style={{ fontWeight: '600', color: '#1e293b' }}>Email Notifications</h4>
                                                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Receive daily updates and course announcements.</p>
                                            </div>
                                        </div>
                                        <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={profile.notify_email} onChange={e => setProfile({...profile, notify_email: e.target.checked})} style={{ opacity: 0, width: 0, height: 0 }} />
                                            <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: profile.notify_email ? '#2563eb' : '#cbd5e1', transition: '.4s', borderRadius: '34px' }}></span>
                                            <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: profile.notify_email ? '26px' : '4px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                                        </label>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '10px', backgroundColor: '#fce7f3', borderRadius: '50%', color: '#ec4899' }}><Smartphone size={20} /></div>
                                            <div>
                                                <h4 style={{ fontWeight: '600', color: '#1e293b' }}>SMS Notifications</h4>
                                                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Receive OTPs and critical alerts on your phone.</p>
                                            </div>
                                        </div>
                                        <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={profile.notify_sms} onChange={e => setProfile({...profile, notify_sms: e.target.checked})} style={{ opacity: 0, width: 0, height: 0 }} />
                                            <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: profile.notify_sms ? '#2563eb' : '#cbd5e1', transition: '.4s', borderRadius: '34px' }}></span>
                                            <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: profile.notify_sms ? '26px' : '4px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                                        </label>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                                    <button onClick={saveNotifications} disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: isSaving ? 'not-allowed' : 'pointer' }}>
                                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;