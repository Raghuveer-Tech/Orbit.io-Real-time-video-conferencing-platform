import React, { useContext, useState, useEffect } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import { IconButton, Snackbar, Alert, Fade, Dialog, DialogContent, CircularProgress } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/home.css';
import Footer from '../components/Footer';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [openSnack, setOpenSnack] = useState(false);
    const [snackMsg, setSnackMsg] = useState("");
    const [userName, setUserName] = useState("User");
    const [currentDateTime, setCurrentDateTime] = useState({ date: "", day: "" });

    const [isJoining, setIsJoining] = useState(false);
    const [isStartingHost, setIsStartingHost] = useState(false);

    const [openHostModal, setOpenHostModal] = useState(false);
    const [generatedHostCode, setGeneratedHostCode] = useState("");

    const { addToUserHistory } = useContext(AuthContext);

    useEffect(() => {
        window.history.pushState(null, '', window.location.href);
        const handlePopState = () => {
            window.history.pushState(null, '', window.location.href);
        };
        window.addEventListener('popstate', handlePopState);

        const storedName = localStorage.getItem("name") || "Raghuveer";
        setUserName(storedName);

        const now = new Date();
        const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };
        const optionsDay = { weekday: 'long' };
        setCurrentDateTime({
            date: now.toLocaleDateString('en-US', optionsDate),
            day: now.toLocaleDateString('en-US', optionsDay)
        });

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    let handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) {
            setSnackMsg("Please enter a valid meeting code!");
            setOpenSnack(true);
            return;
        }
        setIsJoining(true);
        try {
            await addToUserHistory(meetingCode);
            setTimeout(() => {
                navigate(`/${meetingCode}`);
            }, 500);
        } catch (error) {
            setIsJoining(false);
            setSnackMsg("Failed to join meeting.");
            setOpenSnack(true);
        }
    };

    let handleOpenHostModal = () => {
        setGeneratedHostCode(""); 
        setOpenHostModal(true);
    };

    let handleGenerateCodeClick = () => {
        const randomCode = Math.random().toString(36).substring(2, 9);
        setGeneratedHostCode(randomCode);
        setSnackMsg("New meeting code generated!");
        setOpenSnack(true);
    };

    let handleStartHostedMeeting = async () => {
        if (!generatedHostCode) {
            setSnackMsg("Please generate a code first!");
            setOpenSnack(true);
            return;
        }
        setIsStartingHost(true);
        try {
            await addToUserHistory(generatedHostCode);
            setTimeout(() => {
                navigate(`/${generatedHostCode}`);
            }, 600);
        } catch (error) {
            setIsStartingHost(false);
            setSnackMsg("Failed to start meeting.");
            setOpenSnack(true);
        }
    };

    let handleCopyInviteLink = () => {
        if (!generatedHostCode) {
            setSnackMsg("Please generate a code first!");
            setOpenSnack(true);
            return;
        }
        const inviteLink = `${window.location.origin}/${generatedHostCode}`;
        navigator.clipboard.writeText(inviteLink);
        setSnackMsg("Meeting invite link copied to clipboard!");
        setOpenSnack(true);
    };

    let handleCopyCodeOnly = () => {
        if (!generatedHostCode) return;
        navigator.clipboard.writeText(generatedHostCode);
        setSnackMsg("Meeting code copied!");
        setOpenSnack(true);
    };

    return (
        <div className="orbitHomeWrapper">
            {/* टॉप नेविगेशन बार */}
            <div className="orbitHomeNavbar">
                <div className="orbitBrandLogo" onClick={() => navigate("/home")}>
                    <div className="logoIconRow">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-pulse">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#007FFF" />
                        <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="#0059B2" />
                    </svg>
                        <span className="brandNameText">Orbit<span className="brand-accent">.io</span></span>
                    </div>
                    <span className="developerTag">by raghuveer kumawat</span>
                </div>

                <div className="navActionsRight">
                    <button className="navHistoryBtn" onClick={() => navigate("/history")}>
                        <RestoreIcon sx={{ fontSize: 18 }} />
                        <span>History</span>
                    </button>

                    <button className="navLogoutBtn" onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("name");
                        navigate("/auth");
                    }}>
                        <LogoutIcon sx={{ fontSize: 18 }} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* मेन वेलकम और कार्ड्स एरिया */}
            <div className="orbitHomeContentArea">
                <div className="userWelcomeHeader">
                    <div>
                        <p className="dateTimeText">{currentDateTime.day}, {currentDateTime.date}</p>
                    </div>
                </div>

                {/* दो मुख्य कार्ड्स (Host & Join) */}
                <div className="orbitHomeCardsGrid">
                    {/* कार्ड 1: होस्ट मीटिंग */}
                    <div className="orbitFeatureCard hostCard" onClick={handleOpenHostModal}>
                        <div className="cardTopRowWithImage">
                            <div className="cardTextContent">
                                <h3>New Meeting</h3>
                                <p>Create an instant secure room, generate code & share with participants.</p>
                            </div>
                            <img src="/HOME02.jpg" alt="Host Meeting" className="cardCustomIllustration" onError={(e)=>{e.target.style.display='none'}} />
                        </div>
                        <button className="cardActionBtn3D">Host Meeting</button>
                    </div>

                    {/* कार्ड 2: मीटिंग जॉइन करें */}
                    <div className="orbitFeatureCard joinCard">
                        <div className="cardTopRowWithImage">
                            <div className="cardTextContent">
                                <h3>Join Meeting</h3>
                                <p>Enter the secure code shared by your host to enter the room.</p>
                            </div>
                            <img src="/HOME01.jpg" alt="Join Meeting" className="cardCustomIllustration" onError={(e)=>{e.target.style.display='none'}} />
                        </div>
                        <div className="joinInputInline">
                            <input 
                                type="text" 
                                placeholder="Enter meeting code..." 
                                value={meetingCode}
                                onChange={(e) => setMeetingCode(e.target.value)}
                                disabled={isJoining}
                            />
                            <button className="cardActionBtn3D" onClick={handleJoinVideoCall} disabled={isJoining}>
                                {isJoining ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : "Join"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- टू-इमेज बैनर सेक्शन (Fixed Size & Styling) --- */}
                <div className="orbitTwoImageSection">
                    <div className="orbitImageCardBanner">
                        <img src="/HOME01.jpg" alt="Feature 1" className="bannerImageFile" onError={(e)=>{e.target.style.display='none'}} />
                        <div className="bannerTextContent">
                            <h4>Secure & HD Video Calling</h4>
                            <p>Experience crystal clear real-time communications powered by advanced WebRTC streams.</p>
                        </div>
                    </div>

                    <div className="orbitImageCardBanner">
                        <img src="/HOME02.jpg" alt="Feature 2" className="bannerImageFile" onError={(e)=>{e.target.style.display='none'}} />
                        <div className="bannerTextContent">
                            <h4>Seamless Collaboration</h4>
                            <p>Connect instantly with anyone across the globe securely with one click codes.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* होस्ट मीटिंग शेयर करने वाला पॉप-अप */}
            <Dialog 
                open={openHostModal} 
                onClose={() => !isStartingHost && setOpenHostModal(false)}
                PaperProps={{
                    style: {
                        backgroundColor: '#0d1127',
                        border: '1px solid rgba(254, 66, 77, 0.3)',
                        borderRadius: '20px',
                        color: '#fff',
                        width: '100%',
                        maxWidth: '420px',
                        padding: '10px'
                    }
                }}
            >
                <div className="modalHeaderCustom">
                    <div className="modalTitleRow">
                        <VideoCallIcon sx={{ color: '#fe424d' }} />
                        <h3>Ready to Host Meeting</h3>
                    </div>
                    <IconButton onClick={() => setOpenHostModal(false)} sx={{ color: '#94a3b8' }} disabled={isStartingHost}>
                        <CloseIcon />
                    </IconButton>
                </div>

                <DialogContent>
                    <div className="modalBodyContent">
                        <p className="modalSubText">Click the button below to generate a secure meeting code, then share the link or start your meeting.</p>
                        
                        <div className="generatedCodeBoxDisplay">
                            <div className="codeTextInfo">
                                <span className="codeLabelTag">MEETING CODE</span>
                                <span className="codeValueText">{generatedHostCode || "Click Generate ➔"}</span>
                            </div>
                            {generatedHostCode ? (
                                <IconButton onClick={handleCopyCodeOnly} sx={{ color: '#fe424d', background: 'rgba(254,66,77,0.1)', borderRadius: '8px' }} title="Copy Code">
                                    <ContentCopyIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            ) : (
                                <button className="generateInsideModalBtn" onClick={handleGenerateCodeClick}>
                                    <AutorenewIcon sx={{ fontSize: 16 }} /> Generate
                                </button>
                            )}
                        </div>

                        <div className="modalActionButtonsCol">
                            <button className="cardActionBtn3D secondaryActionBtn" onClick={handleCopyInviteLink} disabled={isStartingHost}>
                                Copy Invite Link 🔗
                            </button>
                            <button className="cardActionBtn3D" onClick={handleStartHostedMeeting} disabled={isStartingHost}>
                                {isStartingHost ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : "Start Meeting Now 🚀"}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={openSnack}
                autoHideDuration={3000}
                onClose={() => setOpenSnack(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={Fade}
            >
                <Alert 
                    onClose={() => setOpenSnack(false)} 
                    severity="success" 
                    variant="filled"
                    style={{ backgroundColor: '#fe424d', fontWeight: '600', borderRadius: '10px', color: '#fff' }}
                >
                    {snackMsg}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default withAuth(HomeComponent);