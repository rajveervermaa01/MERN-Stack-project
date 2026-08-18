import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask, updateTask, deleteTask, patchTask } from '../api/taskApi';
import TaskForm from '../components/TaskForm';
import ConfirmDialog from '../components/ConfirmDialog';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';

const PRIORITY_LABEL = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };

export default function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showEdit, setShowEdit] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    const [showDelete, setShowDelete] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [toggleLoading, setToggleLoading] = useState(false);

    async function fetchTask() {
        setLoading(true);
        setError(null);
        try {
            const res = await getTask(id);
            setTask(res.data.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Task not found.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchTask(); }, [id]);

    async function handleEdit(data) {
        setEditLoading(true);
        try {
            await updateTask(id, data);
            toast('Task updated!', 'success');
            setShowEdit(false);
            fetchTask();
        } catch {
            toast('Failed to update task.', 'error');
        } finally {
            setEditLoading(false);
        }
    }

    async function handleDelete() {
        setDeleteLoading(true);
        try {
            await deleteTask(id);
            toast('Task deleted.', 'success');
            navigate('/tasks');
        } catch {
            toast('Failed to delete task.', 'error');
            setDeleteLoading(false);
        }
    }

    async function handleToggle() {
        setToggleLoading(true);
        try {
            await patchTask(id, { completed: !task.completed });
            toast(`Marked as ${!task.completed ? 'completed' : 'pending'}.`, 'success');
            fetchTask();
        } catch {
            toast('Failed to update task.', 'error');
        } finally {
            setToggleLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner size="lg" />
                <p>Loading task…</p>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tasks')} style={{ marginBottom: '1rem' }}>
                    ← Back to Tasks
                </button>
                <div className="alert alert-error">⚠️ {error || 'Task not found.'}</div>
            </div>
        );
    }

    const createdAt = new Date(task.createdAt).toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });

    const updatedAt = new Date(task.updatedAt).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });

    return (
        <div>
            {/* Back */}
            <button
                id="btn-back"
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/tasks')}
                style={{ marginBottom: '1.25rem' }}
            >
                ← Back to Tasks
            </button>

            {/* Hero */}
            <div className="detail-hero">
                <div className="detail-title">{task.title}</div>
                <div className="detail-meta">
                    <span className={`badge badge-${task.priority}`}>
                        {PRIORITY_LABEL[task.priority]}
                    </span>
                    <span className={`badge ${task.completed ? 'badge-done' : 'badge-pending'}`}>
                        {task.completed ? '✅ Completed' : '⏳ Pending'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        📅 Created {createdAt}
                    </span>
                </div>
            </div>

            {/* Description */}
            <div className="detail-desc">
                {task.description
                    ? task.description
                    : <em style={{ color: 'var(--text-muted)' }}>No description provided.</em>}
            </div>

            {/* Timestamps */}
            <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Created At
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{createdAt}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Last Updated
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{updatedAt}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Task ID
                    </div>
                    <code style={{ fontSize: '0.75rem' }}>{task._id}</code>
                </div>
            </div>

            {/* Actions */}
            <div className="detail-actions">
                <button
                    id="btn-toggle-complete"
                    className={`btn ${task.completed ? 'btn-ghost' : 'btn-success'}`}
                    onClick={handleToggle}
                    disabled={toggleLoading}
                >
                    {toggleLoading
                        ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Updating…</>
                        : task.completed ? '↩️ Mark as Pending' : '✅ Mark as Done'}
                </button>

                <button
                    id="btn-edit-task"
                    className="btn btn-primary"
                    onClick={() => setShowEdit(true)}
                >
                    ✏️ Edit Task
                </button>

                <button
                    id="btn-delete-task"
                    className="btn btn-danger"
                    onClick={() => setShowDelete(true)}
                >
                    🗑️ Delete Task
                </button>
            </div>

            {/* Modals */}
            {showEdit && (
                <TaskForm
                    initial={task}
                    onSubmit={handleEdit}
                    onClose={() => setShowEdit(false)}
                    loading={editLoading}
                />
            )}

            {showDelete && (
                <ConfirmDialog
                    message={<>Delete <strong>"{task.title}"</strong>? This cannot be undone.</>}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDelete(false)}
                    loading={deleteLoading}
                />
            )}
        </div>
    );
}
