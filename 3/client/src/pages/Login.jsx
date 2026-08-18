import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';

export default function Login() {
    const { login, error, setError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const [form, setForm] = useState({ email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setError(null);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await login(form.email, form.password);
            navigate(from, { replace: true });
        } catch {
            // error is set in context
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page animate-fade-in" id="login-page">
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <div className="auth-icon">👋</div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account</p>
                </div>

                {error && (
                    <div className="alert alert-error animate-slide-down">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form" id="login-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="login-email">Email</label>
                        <input
                            className="form-input"
                            id="login-email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="login-password">Password</label>
                        <input
                            className="form-input"
                            id="login-password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={submitting}
                        id="login-submit"
                    >
                        {submitting ? <span className="spinner" /> : null}
                        {submitting ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Create one →</Link>
                </p>
            </div>
        </div>
    );
}
