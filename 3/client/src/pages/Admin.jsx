import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

export default function Admin() {
    const { authFetch } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await authFetch('http://localhost:5002/api/admin/users');
                setUsers(data.users);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [authFetch]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner spinner-lg" />
                <p>Loading users…</p>
            </div>
        );
    }

    return (
        <div className="admin-page container animate-fade-in" id="admin-page">
            <header className="admin-header">
                <h1>👑 Admin Panel</h1>
                <p>Manage registered users — admin-only route</p>
            </header>

            {error && (
                <div className="alert alert-error">
                    <span>⚠️</span> {error}
                </div>
            )}

            <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
                <span>ℹ️</span>
                This page is protected by <code>restrictTo('admin')</code> on both the API and client.
            </div>

            <div className="users-table-wrap glass-card">
                <table className="users-table" id="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Registered</th>
                            <th>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td className="user-name-cell">{u.name}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`badge badge-${u.role}`}>{u.role}</span>
                                </td>
                                <td>
                                    {new Date(u.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                    })}
                                </td>
                                <td className="id-cell" title={u.id}>{u.id.slice(0, 8)}…</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <p className="no-users">No users found.</p>
                )}
            </div>
        </div>
    );
}
