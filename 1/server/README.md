# Task Manager REST API (Node.js, Express, MongoDB)

A production-ready RESTful CRUD API built with Node.js, Express, and MongoDB (Mongoose) for managing tasks.

Features include:
- Complete **CRUD** capabilities (GET, POST, PUT, PATCH, DELETE).
- Mongoose Schema with strict validation (`title` required, `priority` enums, `completed` boolean).
- Centralized Error Handling Middleware (Catches bad ObjectIDs, validation errors, and unhandled routes).
- HTTP request logging via `morgan`.
- Built-in **Transparent Offline Fallback** (automatically boots an offline file storage engine if local MongoDB is unreachable).
- Postman Collection deliverable included for instant testing.

---

## 📁 Repository Structure

```
server/
├── .env.example                         # Environment variables template
├── .env                                 # Local environment variables
├── package.json                         # Dependencies & scripts
├── server.js                            # Server entry point
├── task_manager_postman_collection.json # Postman Collection v2.1
└── src/
    ├── app.js                           # Express app initialization & route registration
    ├── config/
    │   ├── db.js                        # MongoDB connection & offline fallback driver
    │   └── db.json                      # Local JSON storage (offline mode)
    ├── controllers/
    │   └── taskController.js           # CRUD action logic
    ├── middleware/
    │   └── errorHandler.js             # Centralized Express error handler
    ├── models/
    │   └── Task.js                      # Mongoose Task Schema & Model
    ├── routes/
    │   └── taskRoutes.js                # API Route declarations
    └── utils/
        ├── ErrorResponse.js             # Custom Error response class
        └── asyncHandler.js              # Higher-order async handler wrapper
```

---

## ⚙️ Requirements & Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default variables in `.env.example`:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/task-manager
NODE_ENV=development
```

---

## 🚀 Quick Start Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Server in Development Mode**:
   ```bash
   npm run dev
   ```

3. **Run Server in Production Mode**:
   ```bash
   npm start
   ```

*Note: If MongoDB is not running locally, the server will seamlessly activate offline file storage mode (`src/config/db.json`), ensuring zero downtime during testing.*

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health Check endpoint |
| `GET` | `/api/v1/tasks` | Get all tasks (supports query param `?completed=true` or `?priority=high`) |
| `GET` | `/api/v1/tasks/:id` | Get single task by ID |
| `POST` | `/api/v1/tasks` | Create a new task |
| `PUT` | `/api/v1/tasks/:id` | Full update on an existing task |
| `PATCH` | `/api/v1/tasks/:id` | Partial update on a task (e.g. toggle completion) |
| `DELETE`| `/api/v1/tasks/:id` | Delete a task by ID |

---

## 📝 Sample Requests & Responses

### 1. Health Check
- **`GET /api/v1/health`**
- **Response `200 OK`**:
```json
{
  "success": true,
  "status": "ok",
  "message": "Task API is running smoothly",
  "timestamp": "2026-08-12T12:00:00.000Z"
}
```

### 2. Create Task
- **`POST /api/v1/tasks`**
- **Request Body**:
```json
{
  "title": "Build CRUD API",
  "description": "Implement Express endpoints with Mongoose validation",
  "priority": "high",
  "completed": false
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "_id": "64d8a1e2f123456789abcdef",
    "title": "Build CRUD API",
    "description": "Implement Express endpoints with Mongoose validation",
    "priority": "high",
    "completed": false,
    "createdAt": "2026-08-12T12:00:00.000Z",
    "updatedAt": "2026-08-12T12:00:00.000Z"
  }
}
```

### 3. Get All Tasks
- **`GET /api/v1/tasks?completed=false`**
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "64d8a1e2f123456789abcdef",
      "title": "Build CRUD API",
      "description": "Implement Express endpoints with Mongoose validation",
      "priority": "high",
      "completed": false,
      "createdAt": "2026-08-12T12:00:00.000Z",
      "updatedAt": "2026-08-12T12:00:00.000Z"
    }
  ]
}
```

### 4. Patch Task (Partial Update)
- **`PATCH /api/v1/tasks/64d8a1e2f123456789abcdef`**
- **Request Body**:
```json
{
  "completed": true
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "_id": "64d8a1e2f123456789abcdef",
    "title": "Build CRUD API",
    "description": "Implement Express endpoints with Mongoose validation",
    "priority": "high",
    "completed": true,
    "updatedAt": "2026-08-12T12:05:00.000Z"
  }
}
```

### 5. Validation Error Example
- **`POST /api/v1/tasks`** with missing `title`:
- **Response `400 Bad Request`**:
```json
{
  "success": false,
  "error": "title is required"
}
```

---

## 📬 Postman Collection

The file [task_manager_postman_collection.json](file:///c:/Users/rajve/OneDrive/Desktop/Project/1/server/task_manager_postman_collection.json) is included in the project root.

To use it:
1. Open Postman.
2. Click **Import** -> Select `task_manager_postman_collection.json`.
3. The variable `baseUrl` is set to `http://localhost:5001`.
4. Creating a task via `POST` will automatically store the new task ID in the `taskId` collection variable for subsequent `GET`, `PUT`, `PATCH`, and `DELETE` requests!
