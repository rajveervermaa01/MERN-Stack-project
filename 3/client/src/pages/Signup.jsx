import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';

export default function Signup() {
    const { signup, error, setError } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [submitting, setSubmitting] = useState(false);
    const [localError, setLocalError] = useState(null);

    const handleChange = (e) => {
        setError(null);
        setLocalError(null);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setLocalError('Passwords do not match.');
            return;
        }

        setSubmitting(true);
        try {
            await signup(form.name, form.email, form.password);
            navigate('/dashboard', { replace: true });
        } catch {
            // error is set in context
        } finally {
            setSubmitting(false);
        }
    };

    const displayError = localError || error;

    return (
        <div className="auth-page animate-fade-in" id="signup-page">
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <div className="auth-icon">🚀</div>
                    <h1>Create Account</h1>
                    <p>Get started in seconds</p>
                </div>

                {displayError && (
                    <div className="alert alert-error animate-slide-down">
                        <span>⚠️</span> {displayError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form" id="signup-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="signup-name">Full Name</label>
                        <input
                            className="form-input"
                            id="signup-name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            required
                            minLength={2}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="signup-email">Email</label>
                        <input
                            className="form-input"
                            id="signup-email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="signup-password">Password</label>
                            <input
                                className="form-input"
                                id="signup-password"
                                name="password"
                                type="password"
                                placeholder="Min 8 chars"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="signup-confirm">Confirm</label>
                            <input
                                className="form-input"
                                id="signup-confirm"
                                name="confirmPassword"
                                type="password"
                                placeholder="Re-enter"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={8}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={submitting}
                        id="signup-submit"
                    >
                        {submitting ? <span className="spinner" /> : null}
                        {submitting ? 'Creating…' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in →</Link>
                </p>
            </div>
        </div>
    );
}
