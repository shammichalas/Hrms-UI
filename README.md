# HRMS UI

The frontend for a Human Resource Management System, built with **React 19**, **TypeScript**, and **Vite**. It provides the dashboard, employee directory, and form workflows on top of the [Hrms-API](https://github.com/shammichalas/Hrms-API) Spring Boot backend.

## Why this project

Paired with Hrms-API to demonstrate a full-stack HRMS: a typed, tested API contract on the backend and a polished, animated dashboard experience on the frontend — including the cinematic scroll/motion work I focus on.

## Tech stack

- **React 19 + TypeScript + Vite 8** — app shell and build tooling
- **React Router 7** — routing, including a protected-route layout for authenticated pages
- **TanStack Query** — server-state fetching/caching against the HRMS API
- **Axios** — HTTP client with request/response interceptors for JWT attachment and 401 handling
- **React Hook Form + Zod** — typed form state and schema validation
- **Tailwind CSS 4** — styling
- **Framer Motion + Lenis** — page transitions and smooth scrolling
- **Recharts** — dashboard charts
- **Sonner** — toast notifications

## Structure

```
src/
├── components/
│   ├── layout/     # DashboardLayout, Navbar, Sidebar, BottomNav, ProtectedRoute, PageTransition
│   └── ui/          # Button, Card, Input, Modal, Table, ScrollAnimate, SplitHeading
├── hooks/           # useScrollDirection
├── pages/           # LoginPage, DashboardPage, EmployeesPage, FormsPage
├── utils/           # api.ts (Axios instance + interceptors), cn.ts
├── routes.tsx        # route tree, protected routes wrap the dashboard layout
└── App.tsx           # Lenis smooth-scroll init, toast provider, router
```

Notable patterns:
- **`api.ts`** centralizes the Axios instance: attaches the JWT from local storage on every request, and clears auth state + redirects to `/login` on a `401` response.
- **`ProtectedRoute`** gates the dashboard layout and its child routes (`/`, `/employees`, `/forms`) behind authentication, with `/login` left public.
- **Lenis** is initialized once in `App.tsx` with a custom easing curve, driven by `requestAnimationFrame`, for the smooth-scroll feel across the app.

## Running locally

### Prerequisites
- Node.js 18+
- The [Hrms-API](https://github.com/shammichalas/Hrms-API) backend running on `http://localhost:8080` (the API base URL is currently hardcoded in `src/utils/api.ts`)

### Install & run
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

## Companion project

The backend for this UI lives in [Hrms-API](https://github.com/shammichalas/Hrms-API) (Spring Boot, PostgreSQL, JWT auth).
