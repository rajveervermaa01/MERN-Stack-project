import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, healthCheck } from '../api/taskApi';
import Spinner from '../components/Spinner';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [apiInfo, setApiInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([
            getTasks(),
            healthCheck().catch(() => null),
        ])
            .then(([tasksRes, healthRes]) => {
                setTasks(tasksRes.data.data || []);
                if (healthRes) setApiInfo(healthRes.data);
            })
            .catch((err) => setError(err.message || 'Failed to load data.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner size="lg" />
                <p>Loading dashboard…</p>
            </div>
        );
    }

    const total = tasks.length;
    const done = tasks.filter((t) => t.completed).length;
    const pending = total - done;
    const high = tasks.filter((t) => t.priority === 'high' && !t.completed).length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    const recent = [...tasks]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div>
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Your task management overview at a glance.</p>
            </div>

            {error && (
                <div className="alert alert-error">
                    ⚠️ {error} — Make sure the API server is running on port 5001.
                </div>
            )}

            {apiInfo && (
                <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
                    ✅ <strong>API Online</strong> — {apiInfo.message}
                </div>
            )}

            {/* Stats */}
            <div className="stats-row">
                {[
                    { label: 'Total Tasks', value: total, icon: '📋' },
                    { label: 'Completed', value: done, icon: '✅' },
                    { label: 'Pending', value: pending, icon: '⏳' },
                    { label: 'High Priority', value: high, icon: '🔴' },
                ].map((s) => (
                    <div className="stat-card" key={s.label}>
                        <div style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{s.icon}</div>
                        <div className="stat-number">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Progress */}
            {total > 0 && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Overall Completion</span>
                        <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{pct}%</span>
                    </div>
                    <div className="progress-bar-wrap">
                        <div className="progress-bar" style={{ width: `${pct}%` }} />
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {done} of {total} tasks completed
                    </p>
                </div>
            )}

            {/* Recent tasks */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Tasks</h2>
                <Link to="/tasks" className="btn btn-ghost btn-sm">View All →</Link>
            </div>

            {recent.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No tasks yet</h3>
                    <p>Head to the Tasks page to create your first one.</p>
                    <Link to="/tasks" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        ➕ Create Task
                    </Link>
                </div>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '0.85rem',
                    }}
                >
                    {recent.map((t) => {
                        const priorityColor = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--success)' };
                        return (
                            <Link
                                key={t._id}
                                to={`/tasks/${t._id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div
                                    className="card"
                                    style={{
                                        height: '100%',
                                        borderLeft: `3px solid ${priorityColor[t.priority]}`,
                                        opacity: t.completed ? 0.6 : 1,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            marginBottom: '0.4rem',
                                            textDecoration: t.completed ? 'line-through' : 'none',
                                            color: t.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                                        }}
                                    >
                                        {t.title}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                        {t.completed ? '✅ Done' : '⏳ Pending'} · {t.priority} priority
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
