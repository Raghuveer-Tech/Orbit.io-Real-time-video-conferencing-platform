import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LandingPage from "./pages/landing";
import Authentication from "./pages/authentication";
import { AuthProvider } from "./contexts/AuthContext";
import VideoMeetComponent from "./pages/VideoMeet";
import HomeComponent from "./pages/home";
import History from "./pages/history";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />

              <Route path="/auth" element={<Authentication />} />

              <Route path="/home" element={<HomeComponent />} />
              <Route path="/history" element={<History />} />
              <Route path="/:url" element={<VideoMeetComponent />} />

              {/* Catch-all — must stay last. Handles multi-segment or
                  completely unmatched paths (e.g. /foo/bar) that don't
                  match any route above, including the /:url meeting code route. */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </div>
  );
}

export default App;