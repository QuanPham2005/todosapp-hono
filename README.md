# Todo App - Hono.js Full-Stack Application

A complete Todo application with user authentication, role-based access control (RBAC), and admin dashboard.

## Tech Stack

- **Frontend:** React 18+ (Vite), Tailwind CSS, Shadcn/ui
- **Backend:** Hono.js (Cloudflare Workers)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Auth:** JWT + RBAC (USER/ADMIN)

## Project Structure

```
todoapp-hono/
├── backend/              # Hono.js API
│   ├── src/
│   │   ├── db/          # Drizzle schema & migration
│   │   ├── middlewares/ # Auth & Role check middleware
│   │   ├── routes/      # Router handlers
│   │   └── index.ts     # Entry point
│   ├── wrangler.toml    # Cloudflare Workers config
│   ├── package.json
│   └── tsconfig.json
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── components/  # Shadcn/ui & custom components
│   │   ├── pages/       # Login, Dashboard, Admin
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml   # PostgreSQL setup
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Local Development

1. **Start PostgreSQL**
   ```bash
   docker-compose up -d
   ```

2. **Install dependencies**
   ```bash
   cd backend && npm install
   cd frontend && npm install
   ```

3. **Start Backend (Dev)**
   ```bash
   cd backend
   npm run dev
   ```

4. **Start Frontend (Dev)**
   ```bash
   cd frontend
   npm run dev
   ```

Frontend will be available at `http://localhost:5173`
Backend API at `http://localhost:8787`

## Features

- User authentication with JWT
- Role-based access control (USER/ADMIN)
- Todo CRUD operations
- Admin dashboard with user management
- PostgreSQL database with Drizzle ORM
- TypeScript for type safety
- Tailwind CSS + Shadcn/ui for UI

## Roadmap

- **Phase 1:** Project setup & Docker
- **Phase 2:** Backend (Auth, RBAC, Database)
- **Phase 3:** Frontend (Auth pages, Todo Dashboard, Admin Dashboard)
- **Phase 4:** Deployment (Cloudflare Workers/Pages)

## Deployment Configuration

### Backend - Cloudflare Workers
- The backend is configured via `backend/wrangler.toml`.
- Use `backend/package.json` scripts:
  - `npm run dev` for local Worker development
  - `npm run build` to compile TypeScript to `backend/dist`
  - `npm run deploy` to publish with Wrangler
- Local `DATABASE_URL` is set to PostgreSQL in `docker-compose.yml`.
- In production, set `DATABASE_URL` in the Cloudflare Workers environment.

> Note: Cloudflare Workers do not support raw TCP connections to PostgreSQL in the Workers runtime. If you want a fully supported Workers deployment, use a Cloudflare-supported database such as D1 or rehost the backend on a platform that supports PostgreSQL.

### Frontend - Cloudflare Pages
- The frontend uses Vite and builds to `frontend/dist`.
- Cloudflare Pages can deploy from the `frontend` folder with:
  - Build command: `npm install && npm run build`
  - Output directory: `dist`
- API calls use `VITE_API_BASE`, defaulting to `/api`, so Pages can route `/api/*` to the backend Worker on the same domain.
