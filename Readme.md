# Orbit.io — Real-Time Video Conferencing Platform

Orbit.io is a video calling web app. You can make a meeting room, share the code with people, and talk face to face right in your browser. No app to install, no plugin needed.

## Live Demo Links

- **Frontend (the actual app):** https://orbit-io-real-time-video-conferenci.vercel.app/
- **Backend (the API server):** https://orbit-io-real-time-video-conferencing.onrender.com

---

## Screenshots

### Web App

| Landing Page | Auth Page (Login/Signup) |
|---|---|
| ![Landing Page](Application%20Screenshort/web%20screenshort/landingPage.png) | ![Auth Page](Application%20Screenshort/web%20screenshort/authPage.png) |

| Host Meeting Start | Host / Join Meeting |
|---|---|
| ![Host Meeting Start](Application%20Screenshort/web%20screenshort/hostMeetingStart.png) | ![Host Join Meeting](Application%20Screenshort/web%20screenshort/hostJoinMeeting.png) |

| Video Call In Progress | History Page |
|---|---|
| ![After Code Video](Application%20Screenshort/web%20screenshort/aftercodeVideo.png) | ![History Page](Application%20Screenshort/web%20screenshort/historyPage.png) |

| Responsive Design (Mobile View 1) | Responsive Design (Mobile View 2) |
|---|---|
| ![Responsive Design 1](Application%20Screenshort/web%20screenshort/responsiveDesign01.png) | ![Responsive Design 2](Application%20Screenshort/web%20screenshort/responsiveDesign02.png) |

### Database (MongoDB)

| Users Collection | Meetings Collection |
|---|---|
| ![Users DB](Application%20Screenshort/DB/usersDB.png) | ![Meeting DB](Application%20Screenshort/DB/meetingDB.png) |

---

## What You Can Do In This App

- Sign up and log in with a username and password
- Join a meeting as a guest, no account needed
- Create a new meeting and get a code to share
- Join any meeting using its code
- Turn camera or mic on and off
- Share your screen with everyone in the call
- Chat with text messages during the call
- See who the host of the meeting is
- Host can end the call for all people at once
- See a list of your past meetings on the History page

---

## Tech Used

### Backend (server side)

| Tool | Job |
|---|---|
| Node.js | Runs the backend code |
| Express | Handles all web requests |
| Socket.IO | Sends real-time messages (for video call setup and chat) |
| MongoDB + Mongoose | Stores users and meeting history |
| bcrypt | Turns passwords into safe text before saving |
| Custom JWT (built with Node's `crypto`) | Handles login tokens |
| dotenv | Loads secret settings from `.env` file |
| http-status | Gives readable HTTP status codes |
| nodemon | Auto-restarts server while coding |

### Frontend (what you see)

| Tool | Job |
|---|---|
| React | Builds the pages |
| React Router | Moves between pages |
| Socket.IO Client | Talks to backend in real time |
| Axios | Sends login/signup requests |
| Material UI (MUI) | Buttons, icons, boxes for the design |
| WebRTC | The actual video/audio calling tech (built into browsers) |

### How Video Calling Works (System Design)

```
Your Browser  <---- Direct Video/Audio (WebRTC) ---->  Other Person's Browser
      \                                                        /
       \                                                      /
        \---------- Socket.IO signaling messages ------------/
                          (through the backend server)
```

The video and audio do **not** pass through the server. Your browser connects **directly** to the other browser. This is called peer-to-peer (P2P). The server (Socket.IO) only helps two browsers find each other and swap connection info. Once connected, the actual call runs browser-to-browser.

For meeting rooms with more than 2-3 people, every browser connects to every other browser directly (this is called a mesh setup).

---

## Folder Structure

```
Orbit.io-Real-time-video-conferencing-platform/
│
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js                    -> starts the server
│       ├── config/
│       │   └── mongoDB.config.js     -> connects to MongoDB
│       ├── controllers/
│       │   ├── socketManager.js      -> video call signaling + chat
│       │   └── user.controller.js    -> login, register, logout, history
│       ├── middleware/
│       │   ├── security.js           -> CORS rules + login check
│       │   ├── rateLimiter.js        -> stops too many requests
│       │   └── errorHandler.js       -> handles errors and 404s
│       ├── models/
│       │   ├── user.model.js         -> user data shape
│       │   └── meeting.model.js      -> meeting history data shape
│       └── utils/
│           └── jwt.js                -> makes and checks login tokens
│   └── tests/
│       └── auth.test.js              -> test for the login token code
│
└── frontend/
    ├── .env.example
    ├── package.json
    ├── public/                       -> images, icons, main HTML file
    └── src/
        ├── App.js                    -> all page routes
        ├── environment.js            -> backend URL setting
        ├── contexts/
        │   └── AuthContext.jsx       -> login/signup logic, API calls
        ├── pages/
        │   ├── landing.jsx           -> home page for visitors ("/")
        │   ├── authentication.jsx    -> login/signup page ("/auth")
        │   ├── home.jsx              -> dashboard after login ("/home")
        │   ├── history.jsx           -> old meetings list ("/history")
        │   ├── VideoMeet.jsx         -> the video call room ("/:code")
        │   └── NotFound.jsx          -> shown for a wrong page
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── Features.jsx
        │   └── ErrorBoundary.jsx
        ├── utils/
        │   └── withAuth.jsx          -> blocks a page if not logged in
        └── styles/                   -> CSS file for each page
```

---

## Page Routes (Frontend)

| Page URL | What It Shows | Login Needed? |
|---|---|---|
| `/` | Landing page | No |
| `/auth` | Login / Signup form | No |
| `/home` | Dashboard, start or join meeting | Yes |
| `/history` | List of your past meetings | Yes |
| `/:code` | The video call room | No, but code must be a valid format |
| any other page | 404 Not Found page | No |

---

## API Routes (Backend)

Base URL: `https://orbit-io-real-time-video-conferencing.onrender.com/api/v1/users`

| Method | Route | Login Needed? | What It Does |
|---|---|---|---|
| POST | `/register` | No | Make a new account |
| POST | `/login` | No | Log in, get a token |
| POST | `/logout` | Yes | Log out |
| POST | `/add_to_activity` | Yes | Save a meeting code to your history |
| GET | `/get_all_activity` | Yes | Get your list of past meetings |

Login and register allow only **10 tries every 15 minutes** per user, to stop someone guessing passwords.
All other routes allow **30 requests per minute** per user.

---

## Real-Time Events (Socket.IO)

These messages travel between browser and server to make the video call work.

| Event | Sent By | What It Does |
|---|---|---|
| `join-call` | You, when joining | Tells the server you joined a room |
| `user-joined` | Server | Tells everyone who is in the room |
| `signal` | Both sides | Sends connection info for video/audio |
| `chat-message` | Both sides | Sends a chat message to the room |
| `end-call` | Host only | Ends the call for everyone |
| `call-ended` | Server | Tells everyone the call is over |
| `user-left` | Server | Tells everyone someone left the room |

---

## How To Run It On Your Own Computer

You will need:
- Node.js installed on your computer
- A MongoDB database (a free one from MongoDB Atlas works fine)

### Step 1 — Get the code
```bash
git clone https://github.com/Raghuveer-Tech/Orbit.io-Real-time-video-conferencing-platform.git
cd Orbit.io-Real-time-video-conferencing-platform
```

### Step 2 — Start the backend
```bash
cd backend
npm install
```
Make a file named `.env` inside the `backend` folder, and put this inside:
```
PORT=8000
MONGO_URI=your_mongodb_link_here
JWT_SECRET=any_long_random_text_here
NODE_ENV=development
```
Then run:
```bash
npm run dev
```
Backend will start at `http://localhost:8000`

### Step 3 — Start the frontend
```bash
cd frontend
npm install
```
Make a file named `.env` inside the `frontend` folder, and put this inside:
```
REACT_APP_API_URL=http://localhost:8000
```
Then run:
```bash
npm start
```
App will open at `http://localhost:3000`

### Step 4 — Test the video call
Open the app in two browser tabs. Log in (or join as guest) in both, start a meeting in one tab, open the same meeting code in the other tab. You should see both video feeds talking to each other.

---

## Where It Is Hosted

| Part | Hosting Service | Link |
|---|---|---|
| Frontend | Vercel | https://orbit-io-real-time-video-conferenci.vercel.app/ |
| Backend | Render | https://orbit-io-real-time-video-conferencing.onrender.com |

Render's free plan puts the server to sleep after some time with no traffic. The first request after that can take 30-60 seconds to wake it up. This is normal, not a bug.

---

## Safety Features In This Project

- Passwords are hashed with bcrypt, never saved as plain text
- Login tokens (JWT) are checked in a safe way that resists timing attacks
- The server will not start at all if `JWT_SECRET` or `MONGO_URI` is missing from `.env`
- Only known frontend URLs can talk to the backend (CORS allow-list), and this same list is used for both the API and the real-time socket connection
- Login and signup have a stricter limit, to stop password-guessing attacks
- Typing a random or fake code in the URL shows a safe "Invalid Meeting Link" message, instead of opening your camera right away
- Any wrong or unknown page URL shows a proper 404 page, not a blank screen
- The app can also connect to an optional TURN server for people on strict networks (like office or college Wi-Fi) — this is off by default and only turns on if you add `REACT_APP_TURN_URL`, `REACT_APP_TURN_USERNAME`, and `REACT_APP_TURN_CREDENTIAL` to the frontend `.env` file

## How Each Feature Works (Code Level)

This section shows exactly where each feature lives in the code, so it's clear this is real, not just a description.

**Guest Join**
- File: `frontend/src/pages/landing.jsx`
- Function: `handleOpenGuestModal()`
- What happens: Clicking "Join as Guest" makes a random name like `Guest-XX12` and saves it in the browser's `localStorage`. No login needed, you can go straight into a meeting code.

**Chat Messages**
- Files: `frontend/src/pages/VideoMeet.jsx` (client side) + `backend/src/controllers/socketManager.js` (server side)
- Flow: You type a message and press Send → `sendMessage()` sends it to the server using Socket.IO (`emit('chat-message', ...)`) → the server sends it to everyone in that room → each browser receives it with `socket.on('chat-message', addMessage)` and shows it on screen.
- Note: chat goes through the server (not directly between browsers), unlike video/audio.

**Video & Audio**
- File: `frontend/src/pages/VideoMeet.jsx`
- Function: `getUserMedia()` asks the browser for camera and mic access.
- Functions: `handleVideo()` and `handleAudio()` turn the camera/mic on or off. When turned off, a silent black video track is used instead, so the call connection does not break.

**Screen Share**
- File: `frontend/src/pages/VideoMeet.jsx`
- Function: `getDisplayMedia()` opens the browser's built-in "share your screen" popup.
- It swaps your camera video for your screen video live, without needing to reconnect the call.

---



- Move meeting-room data out of server memory into something like Redis, so it works across more than one server
- Use a proper media server (like LiveKit or mediasoup) for bigger group calls, since right now every person connects directly to every other person, which gets heavy as more people join
- Add more automated tests (right now only the login token code has tests)

---

## Made By

**Raghuveer Kumawat**