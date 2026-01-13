# Copilot Instructions for ISLA Mobility Manager

## Overview
This project is structured into two main parts: **frontend** and **backend**. The frontend is built using React and Vite, while the backend utilizes Node.js with Express and Prisma for database management. The application manages international partnerships and mobilities for students and staff.

## Architecture
- **Frontend**: Located in the `frontend` directory, it handles user interactions and displays data. Key components include:
  - `App.jsx`: Main application component that sets up routing and user state.
  - `Partnerships.jsx`: Manages partnerships, including fetching, creating, and deleting partnerships.

- **Backend**: Located in the `backend` directory, it serves API endpoints and manages data with Prisma. Key files include:
  - `server.js`: Entry point for the Express server.
  - `schema.prisma`: Defines the database schema for users, partnerships, and mobilities.

## Developer Workflows
- **Running the Application**:
  - **Frontend**: Use `npm run dev` in the `frontend` directory to start the Vite development server.
  - **Backend**: Use `npm run dev` in the `backend` directory to start the Express server with Nodemon.

- **Database Seeding**: Run `node prisma/seed.js` to populate the database with initial data.

## Project Conventions
- **Data Handling**: Use Axios for API requests in the frontend. Ensure to handle errors gracefully and provide user feedback.
- **State Management**: Use React's `useState` and `useEffect` hooks for managing component state and side effects.

## Integration Points
- **API Endpoints**: The frontend communicates with the backend through RESTful API endpoints defined in the Express server. Ensure to check the API documentation for available endpoints.
- **Database**: The application uses SQLite as defined in the `.env` file. Ensure the database is properly set up before running the application.

## External Dependencies
- **Frontend**: Key dependencies include React, React Router, and Axios. Ensure to install these using `npm install`.
- **Backend**: Key dependencies include Express, Prisma, and CORS. Install these in the backend directory as well.

## Conclusion
This document serves as a guide for AI coding agents to understand the structure and workflows of the ISLA Mobility Manager project. For any further clarifications, refer to the code comments and documentation within the project.