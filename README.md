# Orbit.io

Orbit.io is a real-time video meeting web app. It lets users sign up, log in, create or join video meeting rooms, chat during calls, and view their meeting history.

This project is made with a React frontend, an Express backend, MongoDB, and Socket.io.

---

## 1. Project Overview

Orbit.io is made for simple and fast video meetings. Users can:

- create an account
- sign in safely
- start a new meeting room
- join a meeting with a code
- talk with other users in real time
- send messages during a meeting
- see past meeting history

The app is built for learning, demo, and small team use.

---

## 2. Main Features

### User features
- Register account
- Login and logout
- Save meeting history
- Join meeting with a code
- Start a meeting room with a generated code

### Meeting features
- Real-time video calling
- Real-time chat inside the meeting
- Host and participant support
- End call option
- Screen share support

### Security features
- JWT token based login
- Password hashing with bcrypt
- CORS setup
- Rate limiting
- Error handling for API requests

---

## 3. Tech Stack

### Frontend
- React
- React Router DOM
- Material UI
- Axios
- Socket.io Client
- CSS and component-based styling

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB
- Mongoose
- JWT
- bcrypt
- dotenv

### Tools
- Nodemon for development
- npm for package management

---

## 4. Application Architecture

The project has two main parts:

1. Frontend
   - This is the user interface.
   - It shows the landing page, login page, home page, history page, and video meeting page.

2. Backend
   - This handles API requests.
   - It manages user login and registration.
   - It stores meeting history in MongoDB.
   - It runs the Socket.io server for live meetings and chat.

### Basic flow
- User opens the app.
- User signs in or creates an account.
- User goes to home page.
- User starts or joins a meeting.
- The app connects to the Socket.io server.
- Video and chat data move in real time.
- Meeting history is saved for the logged-in user.

---

## 5. System Design and Workflow

### User workflow
1. Open landing page
2. Click signup or login
3. Enter username and password
4. Go to home page
5. Create or join a meeting
6. Enter meeting room
7. Use video, audio, chat, and screen share features
8. End meeting and return to home

### Backend workflow
1. Server starts
2. MongoDB connects
3. Express app starts
4. API routes become active
5. Socket.io server listens for meeting events
6. Client joins room
7. Socket events handle join, chat, signal, leave, and end call

### Data flow
- Frontend sends login or register request to backend.
- Backend validates the data.
- Backend saves user data in MongoDB.
- Backend returns a JWT token.
- Frontend stores the token in browser storage.
- Later requests use this token for protected routes.
- Meeting history is stored under the logged-in user.

---

## 6. Folder Structure

```text
Orbit.io/
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── tests/
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── styles/
│       └── utils/
```

---

## 7. File-wise Details

### Backend files

- backend/src/app.js
  - Main server file.
  - Starts Express.
  - Starts Socket.io server.
  - Connects to MongoDB.
  - Loads all routes and middleware.

- backend/src/routes/users.routes.js
  - Defines API routes for login, register, logout, history, and activity saving.

- backend/src/controllers/user.controller.js
  - Handles user login.
  - Handles user registration.
  - Handles meeting history save and fetch.
  - Handles logout response.

- backend/src/controllers/socketManager.js
  - Handles real-time meeting connection.
  - Handles room join, chat, peer signaling, user leave, and end call.

- backend/src/models/user.model.js
  - Stores user data.
  - Fields: name, username, password.

- backend/src/models/meeting.model.js
  - Stores meeting records.
  - Fields: user_id, meetingCode, date.

- backend/src/config/mongoDB.config.js
  - Connects the app to MongoDB.

- backend/src/middleware/security.js
  - Handles JWT auth.
  - Handles CORS.

- backend/src/middleware/rateLimiter.js
  - Limits too many requests from one IP.

- backend/src/middleware/errorHandler.js
  - Handles 404 and server errors.

### Frontend files

- frontend/src/App.js
  - Main routing file.
  - Links landing, auth, home, history, and video meeting pages.

- frontend/src/pages/landing.jsx
  - Landing page.
  - Shows the welcome screen and meeting starter options.

- frontend/src/pages/authentication.jsx
  - Login and signup page.
  - Lets users create an account or sign in.

- frontend/src/pages/home.jsx
  - Main dashboard after login.
  - Gives options to host or join a meeting.
  - Lets users view history and logout.

- frontend/src/pages/history.jsx
  - Shows saved meeting history for the logged-in user.

- frontend/src/pages/VideoMeet.jsx
  - Main meeting room page.
  - Handles camera, audio, chat, screen share, and peer connections.

- frontend/src/contexts/AuthContext.jsx
  - Holds auth functions.
  - Handles login, register, history save, and token storage.

- frontend/src/utils/withAuth.jsx
  - Protects pages that need login.

- frontend/src/environment.js
  - Stores the backend URL.

---

## 8. Database Design

### User collection
Stores user login data.

Fields:
- name
- username
- password
- createdAt
- updatedAt

### Meeting collection
Stores meeting history data.

Fields:
- user_id
- meetingCode
- date
- createdAt
- updatedAt

This design keeps user accounts and meeting history separate and easy to manage.

---

## 9. API Routes

### Auth routes
- POST /api/v1/users/register
  - Register a new user.

- POST /api/v1/users/login
  - Login user and get JWT token.

- POST /api/v1/users/logout
  - Logout user.

### Meeting history routes
- POST /api/v1/users/add_to_activity
  - Save a meeting code to the logged-in user history.

- GET /api/v1/users/get_all_activity
  - Fetch meeting history for the logged-in user.

---

## 10. Setup Instructions

### 1. Clone the project

```bash
git clone <your-repo-url>
cd Orbit.io
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a .env file inside the backend folder.

Example:

```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/orbit
```

Run the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm start
```

The frontend will run on the browser default React port.

---

## 11. Application and Database Screenshots

Please add your screenshots in the screenshots folder.

Suggested images:
- Application landing page
- Login and signup page
- Home page
- Video meeting room
- Meeting history page
- MongoDB database view

Example placeholders:
- screenshots/app-landing.png
- screenshots/app-home.png
- screenshots/app-meeting.png
- screenshots/db-mongodb.png

---

## 12. Notes for Future Improvement

Possible future upgrades:
- Add room password protection
- Add host controls for mute and remove users
- Add recording support
- Add better mobile design
- Add email or OTP login
- Add production deployment with HTTPS

---

## 13. Summary

Orbit.io is a simple but useful real-time video meeting app. It combines modern frontend design, a strong backend, live socket communication, and MongoDB storage. It is a good project for learning full-stack development and real-time web apps.
