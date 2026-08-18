import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home-page animate-fade-in" id="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-glow" />
                <div className="container hero-content">
                    <div className="hero-badge animate-scale-in">🔒 JWT Authentication Demo</div>
                    <h1 className="hero-title">
                        Secure Authentication
                        <span className="hero-title-accent"> with JWT & bcrypt</span>
                    </h1>
                    <p className="hero-subtitle">
                        A full-stack demo showcasing signup/login with hashed passwords,
                        httpOnly cookie tokens, and protected React routes.
                    </p>
                    <div className="hero-actions">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn btn-primary btn-lg">
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" className="btn btn-primary btn-lg">
                                    Get Started →
                                </Link>
                                <Link to="/login" className="btn btn-secondary btn-lg">
                                    Log In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features container">
                <div className="features-grid">
                    <div className="feature-card glass-card">
                        <div className="feature-icon">🔑</div>
                        <h3>bcrypt Hashing</h3>
                        <p>
                            Passwords are salted & hashed with 12 rounds of bcrypt.
                            Raw passwords are never stored.
                        </p>
                    </div>
                    <div className="feature-card glass-card" style={{ animationDelay: '0.1s' }}>
                        <div className="feature-icon">🎫</div>
                        <h3>JWT Tokens</h3>
                        <p>
                            Stateless auth with signed JSON Web Tokens.
                            Configurable expiry & role-based claims.
                        </p>
                    </div>
                    <div className="feature-card glass-card" style={{ animationDelay: '0.2s' }}>
                        <div className="feature-icon">🍪</div>
                        <h3>httpOnly Cookies</h3>
                        <p>
                            Tokens stored in httpOnly, Secure cookies —
                            invisible to JavaScript, immune to XSS theft.
                        </p>
                    </div>
                    <div className="feature-card glass-card" style={{ animationDelay: '0.3s' }}>
                        <div className="feature-icon">🛡️</div>
                        <h3>Protected Routes</h3>
                        <p>
                            Both API endpoints and React routes are guarded.
                            Role-based access control included.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="tech-stack container">
                <h2 className="section-title">Tech Stack</h2>
                <div className="tech-pills">
                    {['Express', 'bcryptjs', 'jsonwebtoken', 'React', 'React Router', 'Vite'].map((t) => (
                        <span key={t} className="tech-pill">{t}</span>
                    ))}
                </div>
            </section>
        </div>
    );
}
