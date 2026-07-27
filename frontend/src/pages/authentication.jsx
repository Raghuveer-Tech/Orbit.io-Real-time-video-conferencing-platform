import * as React from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, Alert, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import '../styles/auth.css';
import Footer from '../components/Footer';

export default function Authentication() {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [formState, setFormState] = React.useState(0); // 0: Sign In, 1: Sign Up
    const [open, setOpen] = React.useState(false);
    const [alertSeverity, setAlertSeverity] = React.useState("success");
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async (e) => {
        e.preventDefault();

        if (formState === 1 && !name.trim()) {
            setError("Please enter your full name.");
            return;
        }
        if (!username.trim()) {
            setError("Please enter your username or email.");
            return;
        }
        if (!password.trim()) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);
        try {
            if (formState === 0) {
                await handleLogin(username, password);

                setAlertSeverity("success");
                setMessage("Success! You are successfully logged in. Redirecting...");
                setOpen(true);

                setTimeout(() => {
                    navigate("/home");
                }, 1500);
            }
            if (formState === 1) {
                await handleRegister(name, username, password);
                setUsername("");
                setPassword("");
                setName("");

                setAlertSeverity("success");
                setMessage("Account created! Please login with your credentials.");
                setOpen(true);
                setError("");
                setFormState(0);
            }
        } catch (err) {
            let msg = err?.response?.data?.message || "Something went wrong. Please check again.";
            setError(msg);

            setAlertSeverity("error");
            setMessage(msg);
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="orbitNoScrollWrapper">

            <div className="orbitAuthNavbar">
                <div className="orbitBrandLogo" onClick={() => navigate("/")}>
                    <div className="logoIconRow">
                        <img
                            src={process.env.PUBLIC_URL + '/orbit-favicon.svg'}
                            alt="Logo"
                            style={{ width: '1.8rem', height: '1.8rem' }}
                        />
                        <span className="brandNameText">Orbit<span className="brand-accent">.io</span></span>
                    </div>
                    <span className="developerTag">by raghuveer kumawat</span>
                </div>

                <div className="navSwitchRight">
                    {formState === 0 ? (
                        <>
                            <span className="navTextLabel">New to Orbit.io ?</span>
                            <button className="navActionBtn" onClick={() => { setFormState(1); setError(""); }}>Signup</button>
                        </>
                    ) : (
                        <>
                            <span className="navTextLabel">Already have an account ?</span>
                            <button className="navActionBtn outlined" onClick={() => { setFormState(0); setError(""); }}>Sign-in</button>
                        </>
                    )}
                </div>
            </div>


            <div className="orbitMainGridArea">
                <div className="orbitGridLeft">
                    <div className="headlineBlock">
                        <h1>Premium video meetings.<br /><span className="orangeHighlightText">Now secure for everyone.</span></h1>
                        <p>Connect, collaborate, and celebrate from anywhere with Orbit.io.</p>
                    </div>

                    <div className="previewImageWrapper">
                        <img src="/image.jpg" alt="Orbit Video Interface" className="orbitLandingPreviewImg" />
                        <div className="liveBadge">
                            <span className="greenDot"></span> Connect Live Video Platform
                        </div>
                    </div>
                </div>

                <div className="orbitGridRight">
                    <div className="orbitFormCard">
                        <h2>{formState === 0 ? "Sign in to Orbit" : "Create Account"}</h2>
                        <p className="cardSubtext">Enter your credentials below to proceed</p>

                        <form onSubmit={handleAuth} className="orbitActualForm" noValidate>
                            {formState === 1 && (
                                <div className="orbitInputGroup">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => { setName(e.target.value); setError(""); }}
                                    />
                                </div>
                            )}

                            <div className="orbitInputGroup">
                                <label>Username or Email</label>
                                <input
                                    type="text"
                                    placeholder="name@example.com"
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value); setError(""); }}
                                />
                            </div>

                            <div className="orbitInputGroup">
                                <label>Password</label>
                                <div className="orbitPasswordWrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                    />
                                    <span className="orbitPwdToggle" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                                    </span>
                                </div>
                            </div>

                            {error && <p className="orbitErrorMsg">{error}</p>}

                            <button type="submit" className="orbitPrimarySubmitBtn" disabled={loading}>
                                {loading ? "Processing..." : (formState === 0 ? "Sign In to Account" : "Register Now")}
                            </button>
                        </form>

                        <div className="mobileFooterSwitch">
                            {formState === 0 ? (
                                <p>New to Orbit.io? <span onClick={() => { setFormState(1); setError(""); }}>Register here</span></p>
                            ) : (
                                <p>Already have an account? <span onClick={() => { setFormState(0); setError(""); }}>Login here</span></p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={Fade}
            >
                <Alert
                    onClose={() => setOpen(false)}
                    severity={alertSeverity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: '10px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                        backgroundColor: alertSeverity === 'success' ? '#10b981' : '#ef4444'
                    }}
                >
                    {message}
                </Alert>
            </Snackbar>
            <Footer />
        </div>
    );
}