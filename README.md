# TaskFlow – Task Management System

A full-stack Task Management System built as part of the AbleSpace Full Stack Developer Technical Assessment.

**Live Demo**: [Deployed URL - TBD]  
**Figma Design**: [Assessment Task](https://www.figma.com/design/obONCFmoTFN27V5H9PHS2X/Assessment-Task?node-id=0-1)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Backend** | NestJS 11, TypeScript |
| **Database** | MongoDB (via Prisma ORM) |
| **Auth** | JWT (JSON Web Tokens) with Guest Login |
| **Icons** | Lucide React |
| **Date Handling** | date-fns |
| **Deployment** | Vercel (Frontend) + Render (Backend) |

## Features

### Core Functionality
- **Guest Login** – One-click login with optional name, JWT-based session persisting across refreshes
- **Projects CRUD** – Create, view, update, delete projects with priority levels
- **Tasks CRUD** – Full task management with status (To Do, Doing, Completed), priorities, labels, due dates
- **Subtasks** – Nested subtask support within each task
- **Comments** – Add comments to tasks with author attribution and timestamps
- **Task Detail View** – Rich detail panel with properties, labels, subtasks table, comments, and a calendar-based date picker

### Theme Support
- **Light & Dark Themes** – Toggle between light and dark modes
- **Persistent Theme** – Theme preference saved in localStorage, persists across page refreshes
- **Smooth Transitions** – CSS transition animations on theme switch
- **Color Accents** – Accent color selection in settings

### Design Fidelity
- Layout, typography, spacing, and colors closely match the provided Figma design
- Priority badges with color-coded pills (Urgent, High, Medium, Low)
- Collapsible status groups in task list (To Do, Doing, Completed)
- Table-based layout with consistent column structure
- Inline "+ Add Task" rows within each status group
- Settings page with Profile, Theme, and Color sub-navigation

### Responsive Design
- **Desktop**: Full sidebar + content layout (~220px sidebar)
- **Tablet**: Responsive tables, condensed layout
- **Mobile**: Collapsible hamburger sidebar, stacked layouts, mobile-optimized forms

### Reusable Components
- `Avatar` – Colored initials or image-based avatars
- `Badge` – Priority pills with configurable colors
- `Button` – Primary, secondary, ghost, danger variants with loading state
- `Dropdown` – Generic dropdown menu with custom trigger support
- `Modal` – Overlay dialog with keyboard support (Escape to close)
- `DatePicker` – Full calendar widget with month navigation

## Project Structure

```
AbleSpace/
├── frontend/                    # Next.js App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/login/    # Guest login page
│   │   │   ├── (dashboard)/     # Protected dashboard layout
│   │   │   │   ├── tasks/       # Task list + detail views
│   │   │   │   ├── projects/    # Project management
│   │   │   │   └── settings/    # Profile, Theme, Color settings
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI primitives
│   │   │   └── layout/          # Sidebar, layout components
│   │   ├── providers/           # Auth & Theme context providers
│   │   ├── lib/                 # API client, utilities
│   │   └── types/               # TypeScript interfaces
│   └── package.json
│
├── backend/                     # NestJS API
│   ├── src/
│   │   ├── auth/                # JWT auth, guest login
│   │   ├── users/               # User profile CRUD
│   │   ├── projects/            # Project CRUD
│   │   ├── tasks/               # Task CRUD + subtasks
│   │   ├── comments/            # Comment CRUD
│   │   └── prisma/              # Database service
│   ├── prisma/
│   │   ├── schema.prisma        # MongoDB schema
│   │   └── seed.ts              # Sample data
│   └── package.json
│
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/guest-login` | Create guest user, return JWT |
| `GET` | `/api/users/me` | Get current user profile |
| `PATCH` | `/api/users/me` | Update user profile |
| `GET` | `/api/projects` | List user's projects |
| `POST` | `/api/projects` | Create project |
| `GET` | `/api/projects/:id` | Get project with tasks |
| `PATCH` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |
| `GET` | `/api/tasks` | List tasks (filter by projectId, status) |
| `POST` | `/api/tasks` | Create task |
| `GET` | `/api/tasks/:id` | Get task detail |
| `PATCH` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |
| `GET` | `/api/tasks/:taskId/comments` | List task comments |
| `POST` | `/api/tasks/:taskId/comments` | Add comment |

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- MongoDB instance (Atlas or local)

### Backend Setup

```bash
cd backend
npm install

# Configure your MongoDB connection
# Edit .env with your DATABASE_URL

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed sample data
npx prisma db seed

# Start development server
npm run start:dev
```

The backend runs on `http://localhost:3001`.

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

The frontend runs on `http://localhost:3000`.

### Environment Variables

**Backend** (`.env`):
```
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/taskmanager"
JWT_SECRET="your-secret-key"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Design Decisions & Deviations

1. **Guest Login**: Implemented as a simple "Continue as Guest" button with optional name input, creating a guest user with auto-generated username. This provides a frictionless entry point while maintaining user identity for task assignments.

2. **Theme Implementation**: Uses CSS custom properties (variables) with Tailwind's `dark:` class utilities, allowing smooth transitions between themes. Theme preference is stored in localStorage.

3. **Database**: MongoDB chosen for its document-oriented flexibility, particularly for the labels array field on tasks and the self-referencing subtasks relationship.

4. **Monorepo Structure**: Frontend and backend are co-located in a single repository but deployed independently. This simplifies development while allowing independent scaling.

5. **Component Architecture**: UI components are designed to be generic and reusable (Avatar, Badge, Button, Dropdown, Modal, DatePicker), while feature-specific components live in their respective feature directories.

## Author

Built by Abhishek for the AbleSpace Technical Assessment.
