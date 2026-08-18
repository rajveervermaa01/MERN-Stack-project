import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route that requires authentication.
 * Redirects to /login if user is not logged in.
 * Optionally restricts by role.
 */
export default function ProtectedRoute({ children, roles }) {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner spinner-lg" />
                <p>Checking authentication…</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
