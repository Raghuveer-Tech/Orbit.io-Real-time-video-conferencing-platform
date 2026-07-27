import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import server from '../environment';
import styles from "../styles/videoComponent.module.css";

const server_url = server.prod;
var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
};

function VideoMeetComponent() {
    let socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState(true);
    let [audio, setAudio] = useState(true);
    let [screen, setScreen] = useState(false);

    // Chat box is opened by default as requested
    let [showModal, setModal] = useState(true);
    let [screenAvailable, setScreenAvailable] = useState(false);
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");

    let [videos, setVideos] = useState([]);
    let videoRef = useRef([]);

    // Naye states: real participant names + kaun host hai
    let [participantNames, setParticipantNames] = useState({});
    let [hostId, setHostId] = useState(null);
    const isHost = hostId !== null && hostId === socketIdRef.current;

    useEffect(() => {
        getPermissions();
        return () => {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const getPermissions = async () => {
        try {
            const initialStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).catch(() => null);

            if (initialStream) {
                setVideoAvailable(true);
                setAudioAvailable(true);
                window.localStream = initialStream;
                if (localVideoref.current) {
                    localVideoref.current.srcObject = initialStream;
                }
            } else {
                setVideoAvailable(false);
                setAudioAvailable(false);
                setVideo(false);
                setAudio(false);
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            }
        } catch (error) {

        }
    };

    useEffect(() => {
        if (!askForUsername) {
            getUserMedia();
        }
    }, [video, audio]);

    // FIX: pehle sirf ek track (jo bhi pehla mila) replace hota tha.
    // Ab video + audio dono tracks properly har peer ko replace/sync kiye jaate hain.
    let getUserMediaSuccess = (stream) => {
        try {
            if (window.localStream && window.localStream !== stream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
        } catch (e) { console.log(e); }

        window.localStream = stream;
        if (localVideoref.current) {
            localVideoref.current.srcObject = stream;
        }

        for (let id in connections) {
            if (id === socketIdRef.current) continue;
            stream.getTracks().forEach(track => {
                const sender = connections[id].getSenders().find(s => s.track && s.track.kind === track.kind);
                if (sender) {
                    sender.replaceTrack(track);
                }
            });
        }
    };

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .catch((e) => {});
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) { }

            let blackSilence = () => new MediaStream([black(), silence()]);
            window.localStream = blackSilence();
            if (localVideoref.current) {
                localVideoref.current.srcObject = window.localStream;
            }

            for (let id in connections) {
                const videoSender = connections[id].getSenders().find(s => s.track && s.track.kind === 'video');
                if (videoSender) videoSender.replaceTrack(window.localStream.getVideoTracks()[0]);

                const audioSender = connections[id].getSenders().find(s => s.track && s.track.kind === 'audio');
                if (audioSender) audioSender.replaceTrack(window.localStream.getAudioTracks()[0]);
            }
        }
    };

    useEffect(() => {
        if (screen) {
            getDisplayMedia();
        }
    }, [screen]);

    let getDisplayMedia = () => {
        if (navigator.mediaDevices.getDisplayMedia) {
            navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                .then(getDisplayMediaSuccess)
                .catch((e) => {
                    setScreen(false);
                });
        }
    };

    // FIX: pehle addStream() + naya createOffer() renegotiation hota tha (deprecated + heavy).
    // Ab sirf video track replace hoti hai, kisi renegotiation ki zarurat nahi.
    let getDisplayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop());
        } catch (e) { }

        window.localStream = stream;
        if (localVideoref.current) {
            localVideoref.current.srcObject = stream;
        }

        const screenVideoTrack = stream.getVideoTracks()[0];

        for (let id in connections) {
            if (id === socketIdRef.current) continue;
            const sender = connections[id].getSenders().find(s => s.track && s.track.kind === 'video');
            if (sender && screenVideoTrack) {
                sender.replaceTrack(screenVideoTrack);
            }
        }

        stream.getTracks().forEach(track => {
            track.onended = () => {
                setScreen(false);
                getUserMedia();
            };
        });
    };

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message);

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }));
                            });
                        });
                    }
                }).catch(e => {});
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => {});
            }
        }
    };

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });

        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('connect', () => {
            // Apna naam bhi bhejo taaki doosre participants ko asli naam dikhe (Participant #xxxx nahi)
            socketRef.current.emit('join-call', window.location.href, username);
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addMessage);

            // Triggered when host ends the call for everyone
            socketRef.current.on('call-ended', () => {
                endCallCleanup();
            });

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id));
                setParticipantNames((prev) => {
                    const updated = { ...prev };
                    delete updated[id];
                    return updated;
                });
                if (connections[id]) {
                    connections[id].close();
                    delete connections[id];
                }
            });

            // Server ab (id, clients, namesMap, hostSocketId) bhejta hai
            socketRef.current.on('user-joined', (id, clients, namesMap, hostSocketId) => {
                if (namesMap) setParticipantNames(namesMap);
                if (hostSocketId) setHostId(hostSocketId);

                clients.forEach((socketListId) => {
                    if (!connections[socketListId] && socketListId !== socketIdRef.current) {
                        connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                        connections[socketListId].onicecandidate = function (event) {
                            if (event.candidate != null) {
                                socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                            }
                        };

                        // FIX: purana onaddstream (deprecated) hata kar modern "ontrack" use kiya
                        // isi ki wajah se remote video/audio black/blank dikh raha tha
                        connections[socketListId].ontrack = (event) => {
                            const remoteStream = event.streams && event.streams[0]
                                ? event.streams[0]
                                : new MediaStream([event.track]);

                            let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                            if (videoExists) {
                                setVideos(videos => {
                                    const updatedVideos = videos.map(video =>
                                        video.socketId === socketListId ? { ...video, stream: remoteStream } : video
                                    );
                                    videoRef.current = updatedVideos;
                                    return updatedVideos;
                                });
                            } else {
                                let newVideo = {
                                    socketId: socketListId,
                                    stream: remoteStream,
                                    autoplay: true,
                                    playsinline: true
                                };

                                setVideos(videos => {
                                    const updatedVideos = [...videos, newVideo];
                                    videoRef.current = updatedVideos;
                                    return updatedVideos;
                                });
                            }
                        };

                        // FIX: addStream() ki jagah addTrack() — modern browsers ke saath compatible
                        if (!window.localStream) {
                            window.localStream = new MediaStream([black(), silence()]);
                        }
                        window.localStream.getTracks().forEach(track => {
                            connections[socketListId].addTrack(track, window.localStream);
                        });
                    }
                });

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue;

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }));
                                });
                        });
                    }
                }
            });
        });
    };

    let silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    };

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    };

    let handleVideo = () => setVideo(!video);
    let handleAudio = () => setAudio(!audio);
    let handleScreen = () => setScreen(!screen);

    let endCallCleanup = () => {
        try {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
        } catch (e) { }
        // Logged-in user ko /home pe bhejo, guest (bina token) ko landing page (/) pe
        const isLoggedIn = !!localStorage.getItem("token");
        window.location.href = isLoggedIn ? "/home" : "/";
    };

    let handleEndCall = () => {
        if (socketRef.current) {
            socketRef.current.emit('end-call');
        }
        endCallCleanup();
    };

    let addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data, socketIdSender: socketIdSender, time: new Date() }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        if (message.trim() === "") return;
        socketRef.current.emit('chat-message', message, username);
        setMessage("");
    };

    let connect = () => {
        if (username.trim() === "") {
            alert("Please enter your name");
            return;
        }
        setAskForUsername(false);
        connectToSocketServer();

        setTimeout(() => {
            if (localVideoref.current && window.localStream) {
                localVideoref.current.srcObject = window.localStream;
            }
        }, 500);
    };

    return (
        <div className={styles.zoomContainerWrapper}>
            {askForUsername === true ? (
                <div className={styles.lobbyContainer}>
                    <div className={styles.lobbyCard}>
                        <h2>Join Video Meeting</h2>
                        <p className={styles.lobbySubText}>Enter your name to preview your camera and join the room.</p>
                        <TextField
                            id="outlined-basic"
                            label="Your Name"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && connect()}
                            variant="outlined"
                            fullWidth
                            className={styles.textFieldCustom}
                        />
                        <Button variant="contained" className={styles.joinButtonPrimary} onClick={connect} fullWidth>
                            Join Now
                        </Button>
                        <div className={styles.videoPreviewContainer}>
                            <video className={styles.videoPreview} ref={localVideoref} autoPlay muted></video>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.meetScreenLayout}>
                    <div className={styles.stageArea}>
                        <div className={styles.topParticipantHeader}>
                            <div className={styles.participantBadgeCount}>
                                <GroupIcon style={{ fontSize: 18 }} />
                                <span>{videos.length + 1} Participants Active</span>
                            </div>
                            {isHost && (
                                <div className={styles.hostIndicatorTop}>
                                    <StarIcon style={{ fontSize: 15 }} />
                                    <span>You are the Host</span>
                                </div>
                            )}
                        </div>

                        <div className={`${styles.conferenceGridView} ${videos.length === 0 ? styles.singleView : ''}`}>
                            {/* Local User Video Box */}
                            <div className={styles.videoBoxWrapper}>
                                <video className={styles.videoElement} ref={localVideoref} autoPlay muted></video>
                                <div className={styles.userNameTag}>
                                    <span>{username} (You)</span>
                                    {isHost && <span className={styles.hostBadge}>Host</span>}
                                </div>
                            </div>

                            {/* Remote Participants Video Boxes */}
                            {videos.map((vid) => (
                                <div key={vid.socketId} className={styles.videoBoxWrapper}>
                                    <video
                                        className={styles.videoElement}
                                        data-socket={vid.socketId}
                                        ref={ref => {
                                            if (ref && vid.stream) {
                                                ref.srcObject = vid.stream;
                                            }
                                        }}
                                        autoPlay
                                        playsInline
                                    >
                                    </video>
                                    <div className={styles.userNameTag}>
                                        <span>{participantNames[vid.socketId] || `Participant #${vid.socketId.slice(0, 4)}`}</span>
                                        {hostId === vid.socketId && <span className={styles.hostBadge}>Host</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Control Toolbar */}
                        <div className={styles.controlToolbar}>
                            <IconButton onClick={handleAudio} className={`${styles.controlBtn} ${!audio ? styles.disabledBtn : ''}`}>
                                {audio === true ? <MicIcon /> : <MicOffIcon />}
                            </IconButton>
                            <IconButton onClick={handleVideo} className={`${styles.controlBtn} ${!video ? styles.disabledBtn : ''}`}>
                                {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
                            </IconButton>
                            {screenAvailable === true ? (
                                <IconButton onClick={handleScreen} className={`${styles.controlBtn} ${screen ? styles.activeScreenBtn : ''}`}>
                                    {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                                </IconButton>
                            ) : null}
                            <Badge badgeContent={newMessages} max={999} color='error'>
                                <IconButton onClick={() => { setModal(!showModal); setNewMessages(0); }} className={styles.controlBtn}>
                                    <ChatIcon />
                                </IconButton>
                            </Badge>
                            <IconButton onClick={handleEndCall} className={styles.endCallBtn}>
                                <CallEndIcon />
                            </IconButton>
                        </div>
                    </div>

                    {/* Right-Side Chat Panel (WhatsApp style) */}
                    {showModal ? (
                        <div className={styles.rightChatPanel}>
                            <div className={styles.chatHeader}>
                                <h3>In-call Messages</h3>
                                <button className={styles.closeChatBtn} onClick={() => setModal(false)}>✕</button>
                            </div>
                            <div className={styles.chattingDisplay}>
                                {messages.length !== 0 ? messages.map((item, index) => {
                                    const isOwn = item.socketIdSender === socketIdRef.current;
                                    return (
                                        <div
                                            className={`${styles.chatMessageBubble} ${isOwn ? styles.ownBubble : styles.otherBubble}`}
                                            key={index}
                                        >
                                            {!isOwn && <p className={styles.chatSenderName}>{item.sender}</p>}
                                            <p className={styles.chatMessageText}>{item.data}</p>
                                            <span className={styles.chatTimeText}>
                                                {item.time ? item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                    );
                                }) : <p className={styles.noMessageText}>No messages yet. Send a message to start chatting!</p>}
                            </div>
                            <div className={styles.chattingAreaInputBox}>
                                <TextField
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            sendMessage();
                                        }
                                    }}
                                    id="chat-input-field"
                                    label="Type a message..."
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                />
                                <Button variant='contained' className={styles.sendChatBtn} onClick={sendMessage}>Send</Button>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}

export default VideoMeetComponent;