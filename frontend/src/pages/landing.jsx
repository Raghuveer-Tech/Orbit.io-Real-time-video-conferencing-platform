import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/landing.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeaturesSection from '../components/Features';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import { TextField } from '@mui/material';

export default function LandingPage() {
    const router = useNavigate();
    
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null); // 'host' or 'join'
    const [generatedCode, setGeneratedCode] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [copied, setCopied] = useState(false);

    const generateUniqueCode = () => {
        const randomStr = Math.random().toString(36).substring(2, 8);
        const timestamp = Date.now().toString(36).slice(-4);
        return `${randomStr}-${timestamp}`;
    };

    const handleOpenGuestModal = () => {
        if (!localStorage.getItem('username')) {
            const guestName = `Guest-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            localStorage.setItem('username', guestName);
        }
        setShowModal(true);
        setModalType(null);
        setGeneratedCode('');
        setCopied(false);
    };

    const handleHostChoice = () => {
        setModalType('host');
        setGeneratedCode('');
        setCopied(false);
    };

    const handleGenerateCodeClick = () => {
        const newCode = generateUniqueCode();
        setGeneratedCode(newCode);
        setCopied(false);
    };

    const handleCopyCode = () => {
        if (!generatedCode) return;
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleStartHostedMeeting = () => {
        if (!generatedCode) return;
        router(`/${generatedCode}`);
    };

    const handleJoinMeetingSubmit = () => {
        const code = joinCode.trim();
        if (!code) {
            alert("Please paste a valid meeting code!");
            return;
        }
        router(`/${code}`);
    };

    // Elegant and professional gray / slate color scheme (Smooth, premium, non-flashy)
    const elegantBaseBtn = {
        backgroundColor: '#374151', // Slate gray
        color: '#f9fafb',
        border: '1px solid #4b5563',
        borderRadius: '8px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    };

    const elegantActionBtn = {
        backgroundColor: '#4b5563', // Lighter slate for action/confirm buttons
        color: '#ffffff',
        border: '1px solid #6b7280',
        borderRadius: '8px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    };

    return (
        <div className='landingPageContainer'>
            <Navbar />

            <div className="landingMainContainer">
                <div className="hero-left-content">
                    <h1>
                        Premium video meetings. <br />
                        <span className="text-highlight">Now free for everyone.</span>
                    </h1>
                    <p className="hero-subtext">
                        Connect, collaborate, and celebrate from anywhere with Orbit.io. Highly secure and crystal-clear real-time video calls.
                    </p>
                    <div className="hero-action-buttons">
                        <button 
                            className="btn-instant-join" 
                            onClick={handleOpenGuestModal}
                            style={elegantBaseBtn}
                        >
                            <VideoCallIcon style={{ marginRight: '8px' }} />
                            Join as Guest
                        </button>

                        <Link to="/auth" className="btn-trial-link" style={{ marginTop: '15px', display: 'block' }}>
                            New to Orbit.io ? Signup
                        </Link>
                    </div>
                </div>

                <div className="hero-right-media">
                    <div className="video-image-frame">
                        <img src="/mobile.jpg" className="hero-call-image" alt="Orbit Video Call Platform Screen" />
                        <img src="/environment.jpg" className="hero-call-image" alt="Orbit Video Call Platform Screen" />
                        <div className="video-status-tag">
                            <span className="status-dot"></span> Connect Live Video Platform
                        </div>
                    </div>
                </div>
            </div>

            {/* POPUP MODAL OVERLAY */}
            {showModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="modal-content" style={{
                        background: '#18181b', padding: '30px', borderRadius: '12px',
                        width: '400px', maxWidth: '90%', color: '#fff', position: 'relative',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.6)', border: '1px solid #27272a'
                    }}>
                        <button 
                            onClick={() => setShowModal(false)}
                            style={{
                                position: 'absolute', top: '15px', right: '15px',
                                background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer'
                            }}
                        >
                            <CloseIcon />
                        </button>

                        {/* STEP 1: Choose Host or Join */}
                        {modalType === null && (
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ marginBottom: '20px', color: '#e5e7eb', fontWeight: '600' }}>Get Started</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <button 
                                        onClick={handleHostChoice}
                                        style={{ ...elegantBaseBtn, width: '100%', padding: '12px' }}
                                    >
                                        Host a Meeting
                                    </button>
                                    <button 
                                        onClick={() => setModalType('join')}
                                        style={{ ...elegantBaseBtn, width: '100%', padding: '12px' }}
                                    >
                                        Join a Meeting
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2A: HOST A MEETING */}
                        {modalType === 'host' && (
                            <div>
                                <h3 style={{ marginBottom: '15px', color: '#e5e7eb', textAlign: 'center', fontWeight: '600' }}>Host Meeting</h3>
                                
                                {!generatedCode ? (
                                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                                        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '15px' }}>Click below to create your unique code:</p>
                                        <button 
                                            onClick={handleGenerateCodeClick}
                                            style={{ ...elegantActionBtn, padding: '10px 20px', width: '100%' }}
                                        >
                                            Generate Code
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Your meeting code:</p>
                                        <div style={{ 
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            background: '#27272a', padding: '10px 15px', borderRadius: '8px', border: '1px solid #3f3f46',
                                            marginBottom: '20px'
                                        }}>
                                            <span style={{ fontFamily: 'monospace', fontSize: '16px', letterSpacing: '1px', color: '#d1d5db' }}>{generatedCode}</span>
                                            <button 
                                                onClick={handleCopyCode} 
                                                style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                title="Copy Code"
                                            >
                                                <ContentCopyIcon fontSize="small" /> {copied ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>

                                        <button 
                                            onClick={handleStartHostedMeeting}
                                            style={{ ...elegantActionBtn, width: '100%', padding: '10px', marginBottom: '10px' }}
                                        >
                                            Join
                                        </button>
                                    </div>
                                )}

                                <button 
                                    onClick={() => setModalType(null)} 
                                    style={{ width: '100%', background: 'transparent', border: '1px solid #3f3f46', color: '#9ca3af', borderRadius: '8px', padding: '8px', cursor: 'pointer', marginTop: '5px' }}
                                >
                                    Back
                                </button>
                            </div>
                        )}

                        {/* STEP 2B: JOIN A MEETING */}
                        {modalType === 'join' && (
                            <div>
                                <h3 style={{ marginBottom: '15px', color: '#e5e7eb', textAlign: 'center', fontWeight: '600' }}>Join Meeting</h3>
                                <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '10px' }}>Paste your sharing code below:</p>
                                
                                <div style={{ marginBottom: '20px' }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        placeholder="Paste meeting code here..."
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleJoinMeetingSubmit()}
                                        autoFocus
                                        sx={{
                                            input: { color: '#fff' },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: '#3f3f46' },
                                                '&:hover fieldset': { borderColor: '#6b7280' },
                                                '&.Mui-focused fieldset': { borderColor: '#9ca3af' },
                                            }
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <button 
                                        onClick={handleJoinMeetingSubmit}
                                        style={{ ...elegantActionBtn, flex: 1, padding: '10px' }}
                                    >
                                        Join
                                    </button>
                                </div>
                                <button 
                                    onClick={() => setModalType(null)} 
                                    style={{ width: '100%', background: 'transparent', border: '1px solid #3f3f46', color: '#9ca3af', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}
                                >
                                    Back
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}

            <FeaturesSection />
            <Footer />
        </div>
    );
}