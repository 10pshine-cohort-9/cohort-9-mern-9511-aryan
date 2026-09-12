# Track Box — MERN Stack Notes Application

A full-stack notes workspace built for the **10Pearls Internship Program (Cohort 9)**. The application combines a MongoDB, Express, React, and Node.js architecture with a TypeScript-powered frontend, secure JWT authentication, rich-text editing, and complete note CRUD operations.

The interface uses a responsive dark-slate glassmorphism design to provide a focused writing experience. Authenticated users can create, read, update, delete, pin, color-code, tag, search, and filter their own notes.

## Tech Stack

### Backend

| Technology | Purpose |
| --- | --- |
| **Node.js** | JavaScript runtime for the API server |
| **Express** | REST API routing and middleware |
| **MongoDB** | Document database for users and notes |
| **Mongoose** | Schema modeling, validation, indexes, and database access |
| **JSON Web Token (JWT)** | Stateless authentication and protected API access |
| **bcryptjs** | Password hashing and credential verification |
| **Pino / Pino HTTP** | Structured application and HTTP request logging |
| **Mocha, Chai, Sinon, Supertest** | Backend unit and API testing |

### Frontend

| Technology | Purpose |
| --- | --- |
| **React 19** | Component-based user interface |
| **Vite** | Development server and production bundler |
| **TypeScript** | Static typing for components, API models, and application state |
| **Tailwind-inspired CSS / Glassmorphism** | Responsive dark-slate theme, translucent panels, and reusable UI styles |
| **Axios** | API communication and JWT request interceptors |
| **React Router** | Client-side routing and protected routes |
| **Lucide React** | Consistent interface icons |
| **React Quill New** | Rich-text note editor |
| **Vitest / React Testing Library** | Frontend unit and component testing |

## Core Features

### Authentication and authorization

- Create an account with a name, email address, and password.
- Sign in with JWT token-based sessions and automatic session validation.
- Hash passwords before persistence and keep password fields out of normal database responses.
- Attach bearer tokens to authenticated API requests through an Axios interceptor.
- Protect all note routes and enforce per-user ownership before reading, updating, or deleting a note.
- Clear invalid or expired sessions and redirect users to the authentication screen.

### Notes workspace

- Create, view, edit, and delete notes through a protected REST API.
- Compose formatted content with the React Quill rich-text editor.
- Add multiple tags and choose a color accent for visual organization.
- Pin important notes and keep pinned items prominent.
- Use responsive note cards, confirmation dialogs, loading states, empty states, and recoverable error states.

### Search and filtering

- Search notes in real time by title, rich-text content, or tags.
- Filter the workspace by a specific tag or pinned status.
- Combine text search and tag/pinned filters without reloading the page.
- Use backend query support for `search`, `tag`, and `isPinned` when integrating server-side filtering.

### Security and reliability

- ReDoS-aware search handling prevents unsafe user-supplied patterns from becoming uncontrolled regular expressions.
- Input sanitization and schema validation constrain user and note data before persistence.
- Strict environment enforcement keeps secrets and deployment-specific values outside source control.
- TypeScript type-checking catches frontend contract and component errors before a build is shipped.
- A centralized Express error handler returns consistent API errors without exposing production stack traces.
- Pino logging provides structured operational visibility, while logging is disabled during automated tests.

## Project Structure

```text
cohort-9-mern-9511-aryan/
├── backend/
│   ├── .env.example              # Backend environment variable template
│   ├── package.json              # Backend dependencies and scripts
│   └── src/
│       ├── config/
│       │   └── db.js             # MongoDB connection
│       ├── controllers/          # HTTP request and response handlers
│       ├── middlewares/          # Authentication, errors, and HTTP logging
│       ├── models/               # Mongoose User and Note schemas
│       ├── routes/               # Authentication, note, and health routes
│       ├── services/             # Authentication and note business logic
│       ├── tests/                # Mocha/Chai API tests and test setup
│       ├── utils/                # Logger and custom error classes
│       ├── app.js                # Express application configuration
│       └── server.js             # Database connection and server startup
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── api/                  # Configured Axios client
│   │   ├── assets/               # Application images and icons
│   │   ├── components/           # Navbar, note cards, editor, and dialogs
│   │   ├── context/              # Authentication context and session state
│   │   ├── pages/                # Auth, dashboard, and not-found pages
│   │   ├── test/                 # Vitest component tests and setup
│   │   ├── types/                # Shared TypeScript interfaces
│   │   ├── App.tsx               # Routes and protected-route composition
│   │   ├── index.css             # Theme and glassmorphism styles
│   │   └── main.tsx              # React entry point
│   ├── package.json              # Frontend dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   └── vite.config.ts            # Vite, test, proxy, and dev-server config
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the application:

- **Node.js 20 or later** and npm
- **MongoDB** running locally, or a MongoDB Atlas connection string
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/AryanMirza1/cohort-9-mern-9511-aryan.git
cd cohort-9-mern-9511-aryan
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment variables

Create `backend/.env` from the supplied example file:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Then update `backend/.env`:

```dotenv
PORT=5000
MONGO_URI=mongodb://localhost:27017/track_box_db
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | API server port; defaults to `5000` |
| `MONGO_URI` | Yes | Local MongoDB or MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Long, private value used to sign and verify access tokens |
| `JWT_EXPIRES_IN` | No | JWT lifetime such as `7d`, `12h`, or `30m` |
| `NODE_ENV` | No | Runtime mode: `development`, `test`, or `production` |

> Never commit `.env` files or use the example JWT secret in a deployed environment.

### 4. Install frontend dependencies

From the repository root:

```bash
cd frontend
npm install
```

The frontend uses `http://localhost:5000/api` by default. To point it to another API, create `frontend/.env.local` with:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

Use HTTPS for a remotely hosted API. Plain HTTP API URLs are accepted only for loopback development hosts.

### 5. Start MongoDB

Ensure the MongoDB service is running locally, or confirm that `MONGO_URI` points to an accessible MongoDB Atlas deployment.

### 6. Start the development servers

Open two terminals from the repository root.

Terminal 1 — backend API:

```bash
cd backend
npm run dev
```

Terminal 2 — frontend application:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser. The API runs at [http://localhost:5000/api](http://localhost:5000/api), and its health endpoint is available at [http://localhost:5000/api/health](http://localhost:5000/api/health).

## API Overview

All note endpoints require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Check API availability | No |
| `POST` | `/api/auth/signup` | Register a user and issue a token | No |
| `POST` | `/api/auth/login` | Authenticate a user and issue a token | No |
| `POST` | `/api/auth/logout` | Complete the client logout flow | No |
| `GET` | `/api/auth/me` | Validate the session and return the current user | Yes |
| `GET` | `/api/notes` | List the current user's notes | Yes |
| `POST` | `/api/notes` | Create a note | Yes |
| `GET` | `/api/notes/:id` | Get one owned note | Yes |
| `PUT` | `/api/notes/:id` | Update an owned note | Yes |
| `DELETE` | `/api/notes/:id` | Delete an owned note | Yes |

Supported list query parameters:

```text
GET /api/notes?search=meeting&tag=work&isPinned=true
```

## Testing and Type-Checking

The backend and frontend are independent npm packages, so run their checks from their respective directories.

### Backend tests

```bash
cd backend
npm test
```

This runs the Mocha test suite with Chai assertions and Supertest API requests.

### Frontend tests

```bash
cd frontend
npm test
```

This runs Vitest in non-watch mode with React Testing Library and the JSDOM environment.

### Frontend type-checking

```bash
cd frontend
npm run typecheck
```

Type-checking uses TypeScript's `--noEmit` mode and does not create build files.

### Optional frontend quality checks

```bash
cd frontend
npm run lint
npm run build
```

Run the backend tests, frontend tests, and frontend type-check before submitting changes.

## Production Notes

- Set `NODE_ENV=production` and provide production-grade `MONGO_URI` and `JWT_SECRET` values.
- Serve the API and frontend over HTTPS.
- Set `VITE_API_URL` to the deployed API base URL before building the frontend.
- Build the frontend with `npm run build`; Vite writes the optimized output to `frontend/dist/`.
- Restrict CORS to trusted frontend origins before exposing the API publicly.

---

Built as part of the **10Pearls Internship Program — Cohort 9**.
