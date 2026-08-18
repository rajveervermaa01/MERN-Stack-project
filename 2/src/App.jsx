import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import About from './pages/About';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />
              <Route path="/about" element={<About />} />
              {/* Catch-all → redirect home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer style={{
            borderTop: '1px solid var(--border)',
            padding: '1.25rem',
            textAlign: 'center',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}>
            TaskFlow SPA &mdash; Built with ⚛️ React &amp; ⚡ Vite &nbsp;·&nbsp; API on{' '}
            <code>localhost:5001</code>
          </footer>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
