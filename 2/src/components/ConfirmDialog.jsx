export default function ConfirmDialog({ message, onConfirm, onCancel, loading }) {
    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
            <div className="modal" role="alertdialog" aria-modal="true" style={{ maxWidth: 400 }}>
                <div className="modal-header">
                    <h2>🗑️ Confirm Delete</h2>
                    <button className="btn btn-ghost btn-icon" onClick={onCancel} aria-label="Close">✕</button>
                </div>
                <p className="confirm-body">{message}</p>
                <div className="modal-footer">
                    <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
                        {loading
                            ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Deleting…</>
                            : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
