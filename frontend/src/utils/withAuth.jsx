import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const router = useNavigate();
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth", { replace: true });
            }
            setIsLoading(false);
        }, [router]);

        if (isLoading) {
            return (
                <div style={{
                    width: '100%',
                    height: '100vh',
                    background: 'radial-gradient(circle at 80% 20%, #091330 0%, #050714 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{ color: '#94a3b8' }}>Loading...</div>
                </div>
            );
        }

        return <WrappedComponent {...props} />
    }

    return AuthComponent;
}

export default withAuth;