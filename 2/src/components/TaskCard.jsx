import { useNavigate } from 'react-router-dom';
import { patchTask } from '../api/taskApi';
import { useToast } from '../context/ToastContext';

const PRIORITY_LABEL = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };

export default function TaskCard({ task, onEdit, onDelete, onRefresh }) {
    const navigate = useNavigate();
    const toast = useToast();

    async function handleToggle(e) {
        e.stopPropagation();
        try {
            await patchTask(task._id, { completed: !task.completed });
            toast(`Task marked as ${!task.completed ? 'completed' : 'pending'}.`, 'success');
            onRefresh();
        } catch {
            toast('Failed to update task.', 'error');
        }
    }

    const createdAt = new Date(task.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });

    return (
        <div
            className={`task-card priority-${task.priority} ${task.completed ? 'completed-task' : ''}`}
            onClick={() => navigate(`/tasks/${task._id}`)}
            role="article"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/tasks/${task._id}`)}
        >
            {/* Checkbox */}
            <button
                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={handleToggle}
                title={task.completed ? 'Mark as pending' : 'Mark as done'}
                aria-label={task.completed ? 'Mark as pending' : 'Mark as done'}
            />

            {/* Content */}
            <div className="task-content">
                <div className="task-title">{task.title}</div>
                {task.description && <div className="task-desc">{task.description}</div>}
                <div className="task-meta">
                    <span className={`badge badge-${task.priority}`}>
                        {PRIORITY_LABEL[task.priority]}
                    </span>
                    <span className={`badge ${task.completed ? 'badge-done' : 'badge-pending'}`}>
                        {task.completed ? '✅ Done' : '⏳ Pending'}
                    </span>
                    <span className="task-date">📅 {createdAt}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="task-actions" onClick={(e) => e.stopPropagation()}>
                <button
                    className="btn btn-ghost btn-sm btn-icon"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                    aria-label="Edit task"
                >
                    ✏️
                </button>
                <button
                    className="btn btn-danger btn-sm btn-icon"
                    onClick={() => onDelete(task)}
                    title="Delete task"
                    aria-label="Delete task"
                >
                    🗑️
                </button>
            </div>
        </div>
    );
}
