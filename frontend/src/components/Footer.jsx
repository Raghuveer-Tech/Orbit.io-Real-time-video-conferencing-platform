import React from 'react';
import '../styles/footer.css';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
    return (
        <div className="footer-wrapper">
            <footer className="orbit-footer">
                <div className="footer-grid">

                    {/* Brand Section */}
                    <div className="footer-brand">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <img
                                src={process.env.PUBLIC_URL + '/orbit-favicon.svg'}
                                alt="Logo"
                                style={{ width: '1.8rem', height: '1.8rem' }}
                            />
                            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>Orbit<span style={{ color: "#FF9839" }}>.io</span></h2>
                        </div>
                        <p className="project-desc">Real-time communications platform built by Raghuveer Kumawat.</p>

                        <div className="social-icons-container">
                            <a href="https://github.com/Raghuveer-Tech" target="_blank" rel="noreferrer"><GitHubIcon /></a>
                            <a href="https://www.instagram.com/raghuveer.kumawatt" target="_blank" rel="noreferrer"><InstagramIcon /></a>
                            <a href="https://in.linkedin.com/in/raghuveer--kumawat" target="_blank" rel="noreferrer"> <LinkedInIcon />  </a>

                        </div>
                    </div>

                    {/* Support Links */}
                    <div className="footer-column">
                        <h4>Support</h4>
                        <ul className="footer-links">
                            <li><a href="https://youtube.com" target="_blank" rel="noreferrer">See how Guest Mode works</a></li>
                            <li><a href="https://youtube.com" target="_blank" rel="noreferrer">How to Use Orbit.io</a></li>
                        </ul>
                    </div>

                    {/* Real Feedback Column */}
                    <div className="footer-column">
                        <h4>Feedback</h4>
                        <ul className="footer-links">
                            <li><a href="mailto:raghuveerkumawat.ob@gmail.com" className="email-highlight">raghuveerkumawat.ob@gmail.com</a></li>
                        </ul>
                    </div>

                </div>

                <div className="footer-bottom">
                    <div>© 2026 <strong>Orbit.io</strong>. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
}