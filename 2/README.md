# TaskFlow — React SPA (Frontend)

A premium, fully-featured React single-page application that consumes the **Task Manager REST API** (Project `1/server`). Built with React 18, React Router v6, Axios, and Vite.

---

## 📌 What You Need To Do

> Follow these steps in order — that's all you have to do!

---

### ✅ Step 1 — Start the API Server

Open **Terminal 1** and run:

```bash
cd Project/1/server
npm install
npm run dev
```

- API starts on `http://localhost:5001`
- If MongoDB is not installed, no problem — the server automatically switches to **offline file-storage mode**.
- You will see: `[Server] running in development mode on port 5001` ✅

---

### ✅ Step 2 — Start the React App

Open **Terminal 2** (a new terminal) and run:

```bash
cd Project/2
npm install
npm run dev
```

- App starts on `http://localhost:5173`
- Open your browser and go to: **http://localhost:5173**

---

### ✅ Step 3 — Use the App

Once the browser is open:

| What you can do | Where |
|---|---|
| 📊 View task summary (total, done, pending) | **Dashboard** (`/`) |
| ➕ Create a new task | **Tasks** page → `New Task` button |
| 📋 Browse, search, and filter tasks | **Tasks** page (`/tasks`) |
| ✅ Mark a task as complete | Click the checkbox on any task card |
| ✏️ Edit a task | Click the ✏️ button on a task card |
| 🗑️ Delete a task | Click the 🗑️ button on a task card |
| 🔍 View task details | Click anywhere on a task card |
| 📡 View API endpoints | **API Docs** page (`/about`) |

---

### ⚠️ If You See an Error

| Error | Solution |
|---|---|
| `502 Bad Gateway` | Backend is not running → Redo Step 1 |
| Navbar shows 🔴 offline | API is down → Run `npm run dev` inside `Project/1/server` |
| `Port already in use` | A server is already running in another terminal — use that one |

---

### 📋 Quick Checklist

- [ ] Terminal 1: `npm run dev` is running inside `Project/1/server`
- [ ] Terminal 2: `npm run dev` is running inside `Project/2`
- [ ] Browser is open at `http://localhost:5173`
- [ ] Navbar shows **🟢 API online**
- [ ] Dashboard displays task stats

---

## ✨ Features

| Feature | Details |
|---|---|
| **Dashboard** | Stats cards (total / done / pending / high-priority), completion progress bar, recent-tasks grid |
| **Task List** | Full CRUD — create, read, update, delete tasks via API |
| **Search** | Real-time client-side search across title & description |
| **Filters** | One-click filter: All / Pending / Done / High / Medium / Low |
| **Task Detail** | Dedicated page per task with timestamps, badges, toggle-complete |
| **Inline Toggle** | Check/uncheck tasks directly from the list card (PATCH) |
| **Edit Modal** | Form pre-filled with existing data (PUT) |
| **Delete Confirm** | Confirmation dialog before hard-delete (DELETE) |
| **Toast Notifications** | Success/error toasts for every action |
| **Live API Status** | Navbar pings `/health` every 15 s — shows 🟢 online / 🔴 offline |
| **API Docs Page** | Built-in reference — endpoints, schema, example payloads |
| **Loading States** | Spinner overlays while fetching |
| **Error Handling** | Alert banners with API error messages |
| **Responsive** | Works on desktop and mobile |

---

## 📁 Project Structure

```
2/
├── index.html                    # HTML entry point + SEO meta
├── vite.config.js                # Vite config (proxy → port 5001)
├── package.json
└── src/
    ├── main.jsx                  # React DOM entry
    ├── App.jsx                   # Router + layout shell
    ├── index.css                 # Global design system (dark theme)
    ├── api/
    │   └── taskApi.js            # Axios client for all API calls
    ├── context/
    │   └── ToastContext.jsx      # Global toast notification context
    ├── components/
    │   ├── Navbar.jsx            # Sticky nav + live API health dot
    │   ├── TaskCard.jsx          # Task list row with inline actions
    │   ├── TaskForm.jsx          # Create / Edit modal form
    │   ├── ConfirmDialog.jsx     # Delete confirmation modal
    │   └── Spinner.jsx           # Reusable loading spinner
    └── pages/
        ├── Dashboard.jsx         # Stats + recent tasks overview
        ├── TaskList.jsx          # Full tasks CRUD list
        ├── TaskDetail.jsx        # Single task detail + actions
        └── About.jsx             # API documentation reference
```

---

## ⚙️ Requirements

- **Node.js** ≥ 16
- The **backend API** from `Project/1/server` must be running on port `5001`

---

## 🚀 Quick Start

### 1. Start the API first

```bash
cd ../1/server
npm run dev
# Server starts on http://localhost:5001
```

### 2. Install & run the React app

```bash
cd ../../2
npm install
npm run dev
# App starts on http://localhost:5173
```

The Vite dev server **proxies** all `/api/*` requests to `http://localhost:5001` — no CORS configuration needed.

---

## 🔌 API Integration

All API calls live in `src/api/taskApi.js` using **Axios**:

| Function | Method | Endpoint |
|---|---|---|
| `healthCheck()` | GET | `/api/v1/health` |
| `getTasks(params)` | GET | `/api/v1/tasks` |
| `getTask(id)` | GET | `/api/v1/tasks/:id` |
| `createTask(data)` | POST | `/api/v1/tasks` |
| `updateTask(id, data)` | PUT | `/api/v1/tasks/:id` |
| `patchTask(id, data)` | PATCH | `/api/v1/tasks/:id` |
| `deleteTask(id)` | DELETE | `/api/v1/tasks/:id` |

---

## 🛠 Tech Stack

| Technology | Role |
|---|---|
| **React 18** | UI framework (functional components + hooks) |
| **React Router v6** | Client-side routing (`BrowserRouter`) |
| **Axios** | HTTP client with base URL & headers |
| **Vite** | Lightning-fast dev server & bundler |
| **Vanilla CSS** | Custom design system — dark glassmorphism theme |

---

## 🗺 Routes

| Path | Component | Description |
|---|---|---|
| `/` | Dashboard | Stats + recent tasks |
| `/tasks` | TaskList | Browse, search, filter, CRUD |
| `/tasks/:id` | TaskDetail | Full detail view + actions |
| `/about` | About | API docs & tech stack |
| `*` | Redirect → `/` | 404 catch-all |
