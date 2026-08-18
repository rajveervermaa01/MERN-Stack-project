import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
    const { user, authFetch } = useAuth();
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await authFetch('http://localhost:5002/api/dashboard');
                setDashData(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [authFetch]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner spinner-lg" />
                <p>Loading dashboard…</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page container animate-fade-in" id="dashboard-page">
            <header className="dash-header">
                <div>
                    <h1 className="dash-greeting">
                        Hello, <span className="dash-name">{user?.name}</span> 👋
                    </h1>
                    <p className="dash-sub">This is a protected page — only visible when authenticated.</p>
                </div>
                <span className={`badge badge-${user?.role}`}>{user?.role}</span>
            </header>

            {/* Stats Cards */}
            <div className="dash-cards">
                <div className="dash-card glass-card">
                    <div className="dash-card-icon">🆔</div>
                    <div className="dash-card-body">
                        <span className="dash-card-label">User ID</span>
                        <span className="dash-card-value" title={user?.id}>
                            {user?.id?.slice(0, 8)}…
                        </span>
                    </div>
                </div>

                <div className="dash-card glass-card">
                    <div className="dash-card-icon">📧</div>
                    <div className="dash-card-body">
                        <span className="dash-card-label">Email</span>
                        <span className="dash-card-value">{user?.email}</span>
                    </div>
                </div>

                <div className="dash-card glass-card">
                    <div className="dash-card-icon">📅</div>
                    <div className="dash-card-body">
                        <span className="dash-card-label">Registered</span>
                        <span className="dash-card-value">
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'short', day: 'numeric',
                                })
                                : '—'}
                        </span>
                    </div>
                </div>

                <div className="dash-card glass-card">
                    <div className="dash-card-icon">🕐</div>
                    <div className="dash-card-body">
                        <span className="dash-card-label">Server Time</span>
                        <span className="dash-card-value">
                            {dashData?.serverTime
                                ? new Date(dashData.serverTime).toLocaleTimeString()
                                : '—'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Security Info Panel */}
            <section className="dash-info glass-card">
                <h2>🔐 Security Notes</h2>
                <div className="info-grid">
                    <div className="info-item">
                        <h4>Where to store tokens?</h4>
                        <p>
                            <strong>Best:</strong> httpOnly, Secure, SameSite cookies. They are invisible
                            to JavaScript and immune to XSS token theft.
                        </p>
                        <p>
                            <strong>Avoid:</strong> <code>localStorage</code> / <code>sessionStorage</code> —
                            any XSS vulnerability can exfiltrate tokens.
                        </p>
                    </div>
                    <div className="info-item">
                        <h4>Common Pitfalls</h4>
                        <ul>
                            <li>Weak JWT secrets — use ≥256-bit random strings</li>
                            <li>Not setting token expiry — always set <code>expiresIn</code></li>
                            <li>Storing sensitive data in JWT payload — it's only signed, not encrypted</li>
                            <li>Missing CSRF protection when using cookies (mitigate with SameSite=Lax/Strict)</li>
                            <li>Not validating user still exists after token verification</li>
                        </ul>
                    </div>
                    <div className="info-item">
                        <h4>bcrypt Best Practices</h4>
                        <ul>
                            <li>Use a salt round of 10–12 (higher = slower but more secure)</li>
                            <li>Never log or return password hashes in API responses</li>
                            <li>Compare using <code>bcrypt.compare()</code> — never compare strings directly</li>
                        </ul>
                    </div>
                    <div className="info-item">
                        <h4>Production Checklist</h4>
                        <ul>
                            <li>Set <code>Secure</code> flag on cookies (requires HTTPS)</li>
                            <li>Implement refresh token rotation</li>
                            <li>Rate-limit auth endpoints to prevent brute force</li>
                            <li>Use a real database (MongoDB/PostgreSQL) instead of JSON files</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
