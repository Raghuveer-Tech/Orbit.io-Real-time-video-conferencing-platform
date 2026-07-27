import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            background: 'radial-gradient(circle at 80% 20%, #091330 0%, #050714 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '3rem', margin: 0, color: '#fe424d' }}>404</h1>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                This page doesn't exist.
            </p>
            <button
                onClick={() => navigate("/")}
                style={{
                    background: '#fe424d',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600
                }}
            >
                Go to Home
            </button>
        </div>
    );
}