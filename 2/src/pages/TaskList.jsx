import { useEffect, useState, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api/taskApi';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import ConfirmDialog from '../components/ConfirmDialog';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';

const FILTERS = [
    { label: 'All', value: 'all' },
    { label: '⏳ Pending', value: 'pending' },
    { label: '✅ Done', value: 'done' },
    { label: '🔴 High', value: 'high' },
    { label: '🟡 Medium', value: 'medium' },
    { label: '🟢 Low', value: 'low' },
];

export default function TaskList() {
    const toast = useToast();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [search, setSearch] = useState('');

    // Modal state
    const [showForm, setShowForm] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Delete confirm
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchTasks = useCallback(async () => {
        setError(null);
        try {
            const res = await getTasks();
            setTasks(res.data.data || []);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to fetch tasks.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    // Filtering
    const filtered = tasks
        .filter((t) => {
            if (activeFilter === 'pending') return !t.completed;
            if (activeFilter === 'done') return t.completed;
            if (['high', 'medium', 'low'].includes(activeFilter)) return t.priority === activeFilter;
            return true;
        })
        .filter((t) =>
            search.trim()
                ? t.title.toLowerCase().includes(search.toLowerCase()) ||
                (t.description || '').toLowerCase().includes(search.toLowerCase())
                : true
        );

    // Create / Update
    async function handleFormSubmit(data) {
        setFormLoading(true);
        try {
            if (editTask) {
                await updateTask(editTask._id, data);
                toast('Task updated successfully!', 'success');
            } else {
                await createTask(data);
                toast('Task created successfully!', 'success');
            }
            setShowForm(false);
            setEditTask(null);
            fetchTasks();
        } catch (err) {
            toast(err.response?.data?.error || 'Operation failed.', 'error');
        } finally {
            setFormLoading(false);
        }
    }

    function openCreate() { setEditTask(null); setShowForm(true); }
    function openEdit(task) { setEditTask(task); setShowForm(true); }

    // Delete
    async function handleDelete() {
        setDeleteLoading(true);
        try {
            await deleteTask(deleteTarget._id);
            toast('Task deleted.', 'success');
            setDeleteTarget(null);
            fetchTasks();
        } catch {
            toast('Failed to delete task.', 'error');
        } finally {
            setDeleteLoading(false);
        }
    }

    return (
        <div>
            <div className="page-header">
                <h1>Tasks</h1>
                <p>Create, manage, and track all your tasks.</p>
            </div>

            {error && (
                <div className="alert alert-error">⚠️ {error}</div>
            )}

            {/* Toolbar */}
            <div className="tasks-toolbar">
                {/* Search */}
                <div className="search-input-wrap">
                    <span className="search-icon">🔍</span>
                    <input
                        id="task-search"
                        className="form-control"
                        placeholder="Search tasks…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* New task button */}
                <button id="btn-new-task" className="btn btn-primary" onClick={openCreate}>
                    ➕ New Task
                </button>
            </div>

            {/* Filter bar */}
            <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        className={`filter-btn ${activeFilter === f.value ? 'active' : ''}`}
                        onClick={() => setActiveFilter(f.value)}
                        id={`filter-${f.value}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Count */}
            {!loading && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    {filtered.length} task{filtered.length !== 1 ? 's' : ''} found
                </p>
            )}

            {/* Task list */}
            {loading ? (
                <div className="loading-container"><Spinner size="lg" /><p>Fetching tasks…</p></div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">{search ? '🔎' : '📭'}</div>
                    <h3>{search ? 'No results found' : 'No tasks here'}</h3>
                    <p>
                        {search
                            ? `No tasks match "${search}".`
                            : activeFilter === 'all'
                                ? 'Get started by creating your first task!'
                                : `No ${activeFilter} tasks yet.`}
                    </p>
                    {!search && activeFilter === 'all' && (
                        <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: '1rem' }}>
                            ➕ Create Task
                        </button>
                    )}
                </div>
            ) : (
                <div className="tasks-grid">
                    {filtered.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={openEdit}
                            onDelete={setDeleteTarget}
                            onRefresh={fetchTasks}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            {showForm && (
                <TaskForm
                    initial={editTask}
                    onSubmit={handleFormSubmit}
                    onClose={() => { setShowForm(false); setEditTask(null); }}
                    loading={formLoading}
                />
            )}

            {deleteTarget && (
                <ConfirmDialog
                    message={
                        <>
                            Delete <strong>"{deleteTarget.title}"</strong>? This action cannot be undone.
                        </>
                    }
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleteLoading}
                />
            )}
        </div>
    );
}
