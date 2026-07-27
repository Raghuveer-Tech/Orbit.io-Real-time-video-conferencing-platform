import React from 'react';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ChatIcon from '@mui/icons-material/Chat';
import GroupsIcon from '@mui/icons-material/Groups';
import '../styles/features.css';

export default function FeaturesSection() {
    return (
        <div className="featuresSectionContainer">
            <div className="featuresGrid">

                {/* Feature 1 */}
                <div className="featureCard">
                    <div className="card-overlay">
                        <VideoCallIcon className="feature-icon" />
                        <h4>Peer-to-Peer Connection</h4>
                        <p>Direct browser-to-browser connection for maximum speed and secure calling screens.</p>
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="featureCard">
                    <div className="card-overlay">
                        <ChatIcon className="feature-icon" />
                        <h4>Instant Chat Feature</h4>
                        <p>Exchange live secure text messages instantly with members during the active video call.</p>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="featureCard">
                    <div className="card-overlay">
                        <GroupsIcon className="feature-icon" />
                        <h4>Guest Mode Enabled</h4>
                        <p>No forced registration required. Directly invite and jump into meetings with full control.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}