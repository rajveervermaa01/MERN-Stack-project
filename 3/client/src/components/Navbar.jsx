import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar" id="main-navbar">
            <div className="navbar-inner container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">🔐</span>
                    <span className="brand-text">AuthDemo</span>
                </Link>

                <div className="navbar-links">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="nav-link">
                                Dashboard
                            </Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="nav-link">
                                    Admin
                                </Link>
                            )}
                            <div className="nav-user">
                                <span className="nav-user-name">{user?.name}</span>
                                <span className={`badge badge-${user?.role}`}>{user?.role}</span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-ghost nav-logout-btn" id="logout-btn">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/signup" className="btn btn-primary nav-signup-btn">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
