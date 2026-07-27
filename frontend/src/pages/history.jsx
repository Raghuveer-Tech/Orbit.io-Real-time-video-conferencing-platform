import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Typography, CircularProgress } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import RestoreIcon from '@mui/icons-material/Restore';
import '../styles/history.css';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history || []);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    let formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="orbitHistoryWrapper">
            {/* टॉप नेविगेशन बार */}
            <div className="orbitHistoryNavbar">
                <div className="orbitBrandLogo" onClick={() => routeTo("/home")}>
                    <div className="logoIconRow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#fe424d" />
                            <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="#b32a35" />
                        </svg>
                        <span className="brandNameText">Orbit<span className="brand-accent">.io</span></span>
                    </div>
                    <span className="developerTag">by raghuveer kumawat</span>
                </div>

                <div className="navActionsRight">
                    <button className="navHomeBtn" onClick={() => routeTo("/home")}>
                        <HomeIcon sx={{ fontSize: 18 }} />
                        <span>Home</span>
                    </button>
                </div>
            </div>

            {/* मेन कंटेंट एरिया */}
            <div className="orbitHistoryContentArea">
                <div className="historyHeaderTitle">
                    <div className="titleWithIcon">
                        <RestoreIcon sx={{ color: '#fe424d', fontSize: 28 }} />
                        <h2>Meeting History</h2>
                    </div>
                    <p>View the records of all your past meetings.</p>
                </div>

                {loading ? (
                    <div className="historyLoaderBox">
                        <CircularProgress sx={{ color: '#fe424d' }} />
                    </div>
                ) : (
                    <div className="historyCardsGrid">
                        {meetings.length > 0 ? (
                            meetings.map((e, i) => (
                                <div className="orbitHistoryCard" key={i}>
                                    <div className="historyCardInfo">
                                        <div className="codeBadgeRow">
                                            <span className="codeLabelTag">MEETING CODE</span>
                                            <span className="historyCodeText">{e.meetingCode}</span>
                                        </div>
                                        <div className="historyDateRow">
                                            <span>📅 {formatDate(e.date)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="noHistoryBox">
                                <p>No past meetings found in your history.</p>
                                <button className="navHomeBtn" onClick={() => routeTo("/home")} style={{ marginTop: '10px' }}>
                                    Go to Home
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}