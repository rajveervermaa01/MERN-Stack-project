import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:5002/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper: make a fetch with credentials (cookies)
    const authFetch = useCallback(async (url, options = {}) => {
        const res = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || data.errors?.join(', ') || 'Request failed');
        }
        return data;
    }, []);

    // Check if user is already logged in (cookie-based)
    const checkAuth = useCallback(async () => {
        try {
            const data = await authFetch(`${API}/auth/me`);
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Signup
    const signup = async (name, email, password) => {
        setError(null);
        try {
            const data = await authFetch(`${API}/auth/signup`, {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
            });
            setUser(data.user);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Login
    const login = async (email, password) => {
        setError(null);
        try {
            const data = await authFetch(`${API}/auth/login`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            setUser(data.user);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Logout
    const logout = async () => {
        try {
            await authFetch(`${API}/auth/logout`, { method: 'POST' });
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        error,
        setError,
        login,
        signup,
        logout,
        authFetch,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
