# cohort-9-mern-9511-aryan
Cohort 9 — MERN (NodeJS+ReactJS) assignment for Aryan Ijaz 

# Track Box

Track Box is a full-stack MERN application designed to help users create, organise, manage, and track personal notes and tasks through a clean and responsive dashboard.

This project was developed as part of the Cohort 9 MERN (NodeJS + ReactJS) assignment.

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- Secure password handling
- Create, view, update, and delete notes
- Search and filter notes
- Organised dashboard interface
- Responsive frontend design
- RESTful backend API
- MongoDB database integration
- Error handling and validation
- Environment-based configuration

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt

## Project Structure

```text
track-box/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── assets/
│   └── package.json
│
└── README.md
```

## Prerequisites

Before running the project, make sure the following are installed:

- Node.js
- npm
- MongoDB

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd cohort-9-mern-9511-aryan
```

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/track_box_db
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> Do not commit your real `.env` file or JWT secret to GitHub.

Start the backend server:

```bash
npm run dev
```

If the project does not have a development script, use:

```bash
npm start
```

### Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The terminal will display the local URL where the frontend is running.

## Authentication

Track Box uses JSON Web Tokens (JWT) for authentication.

When a user logs in successfully, the backend generates a signed JWT. Protected backend routes verify the token before allowing access to authenticated resources.

The JWT secret must be supplied using the `JWT_SECRET` environment variable and should never be hard-coded into the application source code.

## Database

The application uses MongoDB with Mongoose.

The MongoDB connection is configured through:

```env
MONGO_URI=mongodb://localhost:27017/track_box_db
```

A different local or cloud MongoDB URI can be supplied through the environment configuration.

## API

The backend follows a RESTful API architecture and provides endpoints for authentication and application data.

Typical functionality includes:

```text
Authentication
POST    Register user
POST    Login user

Notes
GET     Retrieve notes
POST    Create note
PUT     Update note
DELETE  Delete note
```

Exact endpoint paths can be found in the backend route files.

## Security

The project includes several security practices:

- Password hashing
- JWT authentication
- Protected API routes
- Authentication middleware
- Environment variables for sensitive configuration
- Input validation
- Centralised error handling
- Password fields excluded from authenticated user responses

## Development Workflow

Development is performed using feature branches.

Example:

```text
develop
└── feature/frontend/ui-dashboard
```

Changes are submitted through pull requests and merged into the `develop` branch after conflicts and checks are resolved.

## Running the Application

Start MongoDB first.

Then start the backend:

```bash
cd backend
npm install
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend URL displayed by Vite in your browser.

## Troubleshooting

### MongoDB connection error

Make sure MongoDB is running and `MONGO_URI` is correctly configured.

### JWT_SECRET environment variable is missing

Add a JWT secret to the backend `.env` file:

```env
JWT_SECRET=your_secure_random_secret
```

Restart the backend after changing environment variables.

### Dependencies missing

Run:

```bash
npm install
```

inside both the frontend and backend directories.

## Author

**Aryan Ijaz**

Cohort 9 — MERN (NodeJS + ReactJS)

## Assignment

This repository contains the MERN assignment completed for Cohort 9.

The project demonstrates full-stack development using React, Node.js, Express.js, MongoDB, REST APIs, authentication, database integration, and Git/GitHub development workflows.
