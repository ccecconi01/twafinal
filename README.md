This project is published in GitHub: https://github.com/ccecconi01/twafinal

ISLA Mobility Manager - README
Release Notes v1.0.0
This is the initial release of the ISLA Mobility Manager, a dedicated system for managing Erasmus+ international mobilities. This version focuses on automating the partnership management process and providing a clear overview of student and staff mobility flows.

Main Features
User Authentication: Secured login system with role-based access control. The system distinguishes between Administrators (e.g., GRIM office) and Viewers (e.g., Presidency or SIGQ), ensuring data integrity.

Dynamic Statistical Dashboard: Real-time visualization of mobility data, including totals for IN and OUT flows, status tracking (Planned, Ongoing, Completed), and distribution by school (Management or Technology).

Automated Partnership Management: Built-in script to import large institutional partnership lists directly from CSV files. It includes advanced filtering by country, area, and specific mobility types (Studies, Internship, Teaching, or Training).

Mobility Record Tracking: Full management of mobility records for both students and staff. The system supports dynamic form logic to handle different data requirements for different mobility roles.

High-Contrast Institutional UI: User interface designed following the ISLA Gaia brand identity, optimized for clarity and professional use.

Setup Instructions
Follow these steps to run the application from scratch. Ensure you have Node.js installed on your machine.

# 1. Backend Configuration

Open your terminal, navigate to the backend folder and run the following commands:


# Enter the backend directory
cd backend

# Install all necessary dependencies
npm install

# Initialize the database and apply migrations
npx prisma migrate dev --name init

# Create system users and initial fake data
node prisma/seed.js

# Import the real partnership data from the CSV file
npm run import-data

# Start the backend server in development mode
npm run dev
The backend server will be running at http://localhost:3000.

# 2. Frontend Configuration

Open a second terminal window (keep the backend one running), navigate to the frontend folder and run:


# Enter the frontend directory
cd frontend

# Install all necessary dependencies
npm install

# Start the frontend development server
npm run dev
The frontend application will be running at http://localhost:5173. Open this URL in your browser to access the system.

# Access Credentials
You can use the following default credentials to test the system:

Administrator:

User: grim

Password: g1r2i3m4

Viewer:

User: sigq

Password: s1i2g3q4
