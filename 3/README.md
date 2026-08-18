# 🔐 Authentication & Protected Routes (JWT)

Full-stack JWT authentication demo with Express backend and React frontend.

## Architecture

```
3/
├── server.js                    # Express entry point
├── .env                         # Environment variables
├── src/
│   ├── controllers/
│   │   └── auth.controller.js   # Signup, login, logout, getMe
│   ├── middleware/
│   │   ├── auth.js              # JWT verify + role-based access
│   │   ├── errorHandler.js      # Global error handler
│   │   └── validate.js          # Input validation
│   ├── routes/
│   │   ├── auth.routes.js       # /api/auth/*
│   │   └── protected.routes.js  # /api/dashboard, /api/admin/users
│   ├── store/
│   │   └── userStore.js         # File-based JSON user store
│   └── utils/
│       └── jwt.js               # sign / verify / expiryToMs
├── client/                      # React (Vite) frontend
│   └── src/
│       ├── context/AuthContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── ProtectedRoute.jsx
│       └── pages/
│           ├── Home.jsx         # Landing page
│           ├── Login.jsx        # Login form
│           ├── Signup.jsx       # Registration form
│           ├── Dashboard.jsx    # Protected — any auth user
│           └── Admin.jsx        # Protected — admin only
```

## Getting Started

### 1. Install Dependencies

```bash
# Backend
cd 3
npm install

# Frontend
cd client
npm install
```

### 2. Configure Environment

Copy `.env.example` → `.env` and set a strong `JWT_SECRET`:

```env
PORT=5002
JWT_SECRET=your_jwt_secret_here_minimum_32_characters_long
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Run

```bash
# Terminal 1 — Backend (port 5002)
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

## API Endpoints

| Method | Endpoint           | Auth      | Description              |
| ------ | ------------------ | --------- | ------------------------ |
| POST   | `/api/auth/signup`  | Public    | Register new user        |
| POST   | `/api/auth/login`   | Public    | Login & receive JWT      |
| POST   | `/api/auth/logout`  | Public    | Clear JWT cookie         |
| GET    | `/api/auth/me`      | Protected | Get current user profile |
| GET    | `/api/dashboard`    | Protected | Dashboard data           |
| GET    | `/api/admin/users`  | Admin     | List all users           |

## Auth Flow

```
┌──────────┐     POST /signup      ┌──────────┐
│  Client  │ ────────────────────► │  Server  │
│          │                       │          │
│          │  ◄── Set-Cookie: jwt  │  bcrypt  │
│          │      + JSON { user }  │  .hash() │
│          │                       │          │
│          │  GET /dashboard       │          │
│          │  Cookie: jwt ────────►│  jwt     │
│          │                       │  .verify │
│          │  ◄── { data }         │          │
└──────────┘                       └──────────┘
```

---

## 🔒 Security Notes

### Where to Store Tokens

| Storage             | XSS Safe? | CSRF Safe? | Recommendation     |
| ------------------- | --------- | ---------- | ----------------   |
| **httpOnly Cookie** | ✅ Yes    | ⚠️ Mitigated via SameSite | ✅ **Best choice** |
| localStorage        | ❌ No     | ✅ Yes     | ❌ Avoid           |
| sessionStorage      | ❌ No     | ✅ Yes     | ❌ Avoid           |
| In-memory (JS var)  | ✅ Yes    | ✅ Yes     | ⚠️ Lost on refresh |

**This demo uses httpOnly cookies** — the token is set via `Set-Cookie` by the server and is automatically sent on every request. JavaScript cannot read it, making XSS token theft impossible.

### Common Pitfalls

1. **Weak JWT secret** — Use a cryptographically random string ≥ 256 bits. Never hardcode in source.
2. **No token expiry** — Always set `expiresIn`. This demo uses 7 days.
3. **Sensitive data in JWT** — JWT is *signed*, not *encrypted*. Anyone can decode the payload. Never put passwords or sensitive PII.
4. **Missing CSRF protection** — When using cookies, use `SameSite=Lax` or `SameSite=Strict` (this demo uses `Lax`).
5. **Not checking user existence** — Always verify the user still exists in the DB after token verification (user could be deleted).
6. **Logging password hashes** — Never log or return `passwordHash` in API responses.
7. **String comparison for passwords** — Always use `bcrypt.compare()`, never `===`.

### bcrypt Configuration

| Salt Rounds | Time (approx) | Use Case          |
| ----------- | ------------- | ----------------  |
| 10          | ~100ms        | Development       |
| 12          | ~300ms        | **Production** ✅ |
| 14          | ~1s           | High security     |

This demo uses **12 rounds**.

### Production Checklist

- [ ] Use HTTPS and set `Secure` flag on cookies
- [ ] Implement refresh token rotation
- [ ] Rate-limit `/api/auth/login` and `/api/auth/signup`
- [ ] Replace JSON file store with a real database
- [ ] Add password reset flow
- [ ] Implement account lockout after failed attempts
- [ ] Add request logging and monitoring
