import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    width: '100%',
                    minHeight: '100vh',
                    background: 'radial-gradient(circle at 80% 20%, #091330 0%, #050714 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                    padding: '20px',
                    fontFamily: "'Inter', -apple-system, sans-serif"
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>⚠️ Something went wrong</h1>
                    <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                        The app encountered an unexpected error. Please refresh the page or contact support.
                    </p>
                    <details style={{ marginTop: '20px', color: '#64748b', textAlign: 'left', maxWidth: '500px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: '600' }}>Error details</summary>
                        <pre style={{ background: '#0d1127', padding: '10px', borderRadius: '8px', overflow: 'auto' }}>
                            {this.state.error?.toString()}
                        </pre>
                    </details>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{
                            marginTop: '20px',
                            background: 'linear-gradient(135deg, #fe424d 0%, #b32a35 100%)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Return to Home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
