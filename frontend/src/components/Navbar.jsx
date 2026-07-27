import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/navbar.css';

export default function Navbar() {
    const router = useNavigate();
    const [isOpen, setIsOpen] = useState(false);


    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleNavigation = (path) => {
        router(path);
        setIsOpen(false);
    };

    return (
        <nav className="orbit-navbar">
            <div className='navHeader' onClick={() => handleNavigation("/")}>
                <div className="brand-logo-wrapper">
                    <img
                        src={process.env.PUBLIC_URL + '/orbit-favicon.svg'}
                        alt="Logo"
                        style={{ width: '1.8rem', height: '1.8rem' }}
                    />
                    <h2>Orbit<span className="brand-accent">.io</span></h2>
                </div>
            </div>

            {/* Desktop & Mobile Toggle Navlist */}
            <div className={`navlist ${isOpen ? 'active' : ''}`}>
                <p className="nav-item text-small" onClick={() => handleNavigation("/auth")}>
                    New to Orbit.io ? Signup
                </p>
                <div className="login-btn-wrapper" onClick={() => handleNavigation("/auth")}>
                    <p>Already have an account ? Sign-in</p>
                </div>
            </div>

            {/* Material UI Hamburger Icon (< 850px) */}
            <div className="hamburger-icon" onClick={toggleMenu}>
                <IconButton sx={{ color: '#ffffff' }}>
                    {isOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </div>
        </nav>
    );
}