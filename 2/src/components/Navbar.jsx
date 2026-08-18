import { NavLink, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { healthCheck } from '../api/taskApi';

export default function Navbar() {
    const [apiStatus, setApiStatus] = useState('checking');

    useEffect(() => {
        const check = () =>
            healthCheck()
                .then(() => setApiStatus('online'))
                .catch(() => setApiStatus('offline'));
        check();
        const id = setInterval(check, 15000);
        return () => clearInterval(id);
    }, []);

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <span className="brand-icon">✅</span>
                TaskFlow
            </Link>

            <ul className="navbar-links">
                <li>
                    <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/tasks" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Tasks
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
                        API Docs
                    </NavLink>
                </li>
            </ul>

            <div className="navbar-status">
                <span className={`status-dot ${apiStatus}`} />
                <span>API {apiStatus === 'checking' ? '…' : apiStatus}</span>
            </div>
        </nav>
    );
}
