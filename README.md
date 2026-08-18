# Alfido Tech Internship

[![Alfido Tech Logo](https://www.alfidotech.com/img/nav-logo.webp)](https://www.alfidotech.com/)

# MERN Stack Developer Tasks

Hands-on MERN stack development tasks using MongoDB, Express.js, React.js, and Node.js to build real-world full-stack applications.

## Overview

This repository contains a complete MERN stack internship project collection covering:

- REST API development with Node.js and Express
- Database integration with MongoDB
- React frontend development with routing and dynamic UI
- JWT-based authentication and protected routes
- Task management workflows and real-world CRUD operations

The project is structured as multiple mini modules representing different internship tasks and learning milestones.

---

## Objective

Teach interns how to build full-stack JavaScript applications using MongoDB, Express, React, and Node.js. The focus is on:

- REST API design and CRUD operations
- Client-server communication
- Authentication and authorization with JWT
- State management and routing in React
- Deployment and environment setup

---

## Features

- End-to-end JavaScript application stack
- Task CRUD API with validation and error handling
- React-based SPA for managing tasks
- Protected routes and secure login flow
- File-based or MongoDB-backed persistence
- Responsive user interface
- Clean project separation by task

---

## Tech Stack

- Node.js
- Express.js
- MongoDB / Mongoose
- React.js
- Vite
- JWT Authentication
- HTML / CSS / JavaScript

---

## Repository Structure

```text
Project/
├── README.md
├── LICENSE
├── 1/
│   └── server/
│       ├── server.js
│       ├── package.json
│       ├── task_manager_postman_collection.json
│       └── src/
│           ├── app.js
│           ├── config/
│           ├── controllers/
│           ├── middleware/
│           ├── models/
│           ├── routes/
│           └── utils/
├── 2/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── 3/
│   ├── server.js
│   ├── package.json
│   ├── src/
│   └── client/
│       ├── package.json
│       ├── vite.config.js
│       └── src/
└── .gitignore
```

---

## Project Modules

### 1. Task Manager API
Location: `1/server`

This module implements a RESTful API for creating, reading, updating, and deleting tasks.

Features:

- CRUD endpoints for tasks
- MongoDB connection handling
- Validation and error middleware
- Postman collection for API testing
- Offline fallback support if DB is unavailable

Run:

```bash
cd 1/server
npm install
npm run dev
```

Default backend URL:

```text
http://localhost:5001
```

---

### 2. React Task Management Frontend
Location: `2`

This frontend consumes the backend API and provides a user-friendly task dashboard.

Features:

- Dashboard with task statistics
- Search and filtering
- Task creation, edit, delete, and detail view
- Routing with React Router
- Toast notifications and loading states

Run:

```bash
cd 2
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

### 3. JWT Authentication System
Location: `3`

This module demonstrates secure user authentication using JWT and protected routes.

Features:

- User signup and login
- JWT-based session management
- HTTP-only cookies
- Protected dashboard and admin routes
- Frontend with React + Express backend

Run backend:

```bash
cd 3
npm install
npm run dev
```

Run frontend:

```bash
cd 3/client
npm install
npm run dev
```

Backend URL:

```text
http://localhost:5002
```

Frontend URL:

```text
http://localhost:5173
```

---

## Suggested Internship Tasks

The internship program typically includes the following tasks:

### Task 1: Build a RESTful API
- Node.js + Express + MongoDB
- CRUD operations
- Validation and error handling

### Task 2: Frontend SPA with React
- React components and hooks
- Fetching data from API
- Routing and state management
- UI for task operations

### Task 3: Authentication & Protected Routes
- Signup/login flow
- JWT token generation and validation
- Protected access to private pages

### Task 4: Dockerize and Deploy
- Containerization
- Docker Compose or deployment setup
- Production-ready environment configuration

Note: Students are expected to complete any 3 of the 4 tasks as part of the internship submission.

---

## How to Run the Full Project

### Terminal 1 - Backend API

```bash
cd 1/server
npm install
npm run dev
```

### Terminal 2 - React Frontend

```bash
cd 2
npm install
npm run dev
```

### Terminal 3 - Auth API (Optional)

```bash
cd 3
npm install
npm run dev
```

### Terminal 4 - Auth Frontend (Optional)

```bash
cd 3/client
npm install
npm run dev
```

---

## API Endpoints (Task API)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Check server status |
| GET | `/api/v1/tasks` | Get all tasks |
| GET | `/api/v1/tasks/:id` | Get task by ID |
| POST | `/api/v1/tasks` | Create a new task |
| PUT | `/api/v1/tasks/:id` | Update a task |
| PATCH | `/api/v1/tasks/:id` | Partially update a task |
| DELETE | `/api/v1/tasks/:id` | Delete a task |

---

## Learning Outcomes

By completing this project, interns will learn to:

- Design and implement REST APIs
- Connect frontend to backend services
- Manage state and routing in React
- Secure apps with JWT authentication
- Work with real-world project architecture
- Prepare internship deliverables and project documentation

---

## Submission Guidelines

For each task, create separate documentation in DOC, DOCX, or PDF format, including:

- Screenshots of working output
- Key code snippets
- Commands used to run the project
- GitHub or Drive links for the project
- Clear task-wise explanations

Upload the files to Google Drive or GitHub and submit the links through the internship portal.

---

## About Alfido Tech

Alfido Tech empowers students and professionals with certified internships, training, skill-building opportunities, and high-quality IT services including web development, software solutions, AI models, automation tools, and digital support.

Alfido Tech is an independent digital platform focused on education, skill development, and IT services.

- Hyderabad, Telangana
- Email: info@alfidotech.com
- Phone: +91 9977465250

---

## Quick Links

- [Home](https://www.alfidotech.com/)
- [Internship](https://www.alfidotech.com/task/mern.html#)
- [Assessment](https://www.alfidotech.com/assessment.html)
- [Services](https://www.alfidotech.com/service.html)
- [Contact Us](https://www.alfidotech.com/contact.html)
- [Privacy Policy](https://www.alfidotech.com/privacy-policy.html)
- [Terms & Conditions](https://www.alfidotech.com/terms-and-conditions.html)

---

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for details.

---

© 2026 Alfido Tech. All Rights Reserved.

Made with ❤️ in India.
