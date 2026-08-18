import { useState, useEffect } from 'react';

const DEFAULT = { title: '', description: '', priority: 'medium', completed: false };

export default function TaskForm({ initial, onSubmit, onClose, loading }) {
    const [form, setForm] = useState(initial ? { ...initial } : DEFAULT);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm(initial ? { ...initial } : DEFAULT);
        setErrors({});
    }, [initial]);

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Title is required.';
        if (form.title.trim().length > 120) e.title = 'Title must be ≤ 120 characters.';
        return e;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        onSubmit(form);
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
                <div className="modal-header">
                    <h2 id="form-title">{initial ? '✏️ Edit Task' : '➕ New Task'}</h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">✕</button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {/* Title */}
                    <div className="form-group">
                        <label htmlFor="task-title">Title *</label>
                        <input
                            id="task-title"
                            className="form-control"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Implement authentication"
                            autoFocus
                        />
                        {errors.title && <span style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{errors.title}</span>}
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="task-desc">Description</label>
                        <textarea
                            id="task-desc"
                            className="form-control"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Optional notes or details…"
                            rows={3}
                        />
                    </div>

                    {/* Priority */}
                    <div className="form-group">
                        <label htmlFor="task-priority">Priority</label>
                        <select
                            id="task-priority"
                            className="form-control"
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                        >
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                        </select>
                    </div>

                    {/* Completed */}
                    {initial && (
                        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                            <input
                                id="task-completed"
                                type="checkbox"
                                name="completed"
                                checked={form.completed}
                                onChange={handleChange}
                                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--success)' }}
                            />
                            <label htmlFor="task-completed" style={{ textTransform: 'none', letterSpacing: 0, cursor: 'pointer' }}>
                                Mark as completed
                            </label>
                        </div>
                    )}

                    <div className="modal-footer">
                        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading
                                ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Saving…</>
                                : initial ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
