# AccessHub – Role-Based Authentication Dashboard

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> A production-grade role-based authentication dashboard built with React.js — featuring protected routes, JWT session management, and dynamic UI rendering based on user authorization level.

---

## 🔐 Overview

AccessHub demonstrates a complete authentication and authorization workflow in a modern React single-page application. The project simulates real-world auth patterns — token-based sessions, protected routes, role-scoped permissions — without any backend dependency, making it fully portable and instantly deployable.

---

## ✨ Features

- **Role-Based Access Control (RBAC)** — Admin and User roles with distinct permission scopes
- **Protected Routes** — Unauthorized access renders a locked `Access Denied` view rather than redirecting, mirroring real-world guard patterns
- **JWT Session Simulation** — Token issued on login, stored in React Context, visualized with decoded claims (sub, role, exp)
- **Conditional UI Rendering** — Navigation, stats, activity feed, and permission lists all adapt dynamically to the authenticated role
- **Async Auth Flow** — Login simulates a real API call with loading state, error handling, and credential validation
- **Token Inspection Panel** — Displays JWT structure (header · payload · signature) with live session metadata

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Routing Logic | Component-level protected wrappers |
| Auth State | React Context API (`AuthContext`) |
| Styling | Scoped CSS-in-JS (zero external CSS deps) |
| Deployment | Vercel (CI/CD via GitHub) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/accesshub.git
cd accesshub

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Credentials

| Role | Username | Password | Access |
|------|----------|----------|--------|
| Admin | `admin` | `password` | Full system access |
| User | `user` | `password` | Personal dashboard only |

---

## 📁 Project Structure

```
src/
├── AccessHub.jsx       # Main app — auth context, routing, all components
├── main.jsx            # React entry point
└── index.css           # Base reset
```

> The app is intentionally structured as a single-file component to highlight the auth architecture clearly. In a production codebase, each section (AuthContext, ProtectedRoute, pages, components) would be split into its own module.

---

## 🧠 Architecture Highlights

### Auth Context
Global auth state (`token` + `user`) is managed via `React.createContext` and consumed anywhere in the tree with `useAuth()` — no prop drilling, no external state library.

```jsx
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);
```

### Protected Route Pattern
A `ProtectedRoute` wrapper component checks the current user's role against a required role prop, rendering the page or an `<AccessDenied />` fallback:

```jsx
function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (role && user.role !== role) return <AccessDenied />;
  return children;
}
```

### Role-Scoped Navigation
Admin-only navigation items are conditionally rendered based on `user.role`, ensuring unauthorized routes are never exposed in the UI:

```jsx
{isAdmin && (
  <NavSection label="Admin Only">
    <NavItem id="users" label="User Management" />
    <NavItem id="system" label="System Monitor" />
  </NavSection>
)}
```

---

## 🌐 Live Demo

**[accesshub.vercel.app](https://accesshub-sg-of8y.vercel.app/)**

---

## 📌 What I Built & Learned

- Designed a scalable RBAC pattern using React Context without any auth library
- Implemented token-based session handling with simulated async API flows
- Built a `ProtectedRoute` component that mirrors real-world route guard patterns (Next.js middleware, React Router `loader`)
- Practiced conditional rendering strategies for authorization-aware UI
- Structured a modular component architecture that separates concerns cleanly within a single application

---

## 📄 License

MIT © 2024 — feel free to use this as a reference or starting point for your own auth implementations.#
