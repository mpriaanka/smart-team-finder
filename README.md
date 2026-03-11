# Smart Team Finder for Hackathons

A modern full-stack web application to help students find hackathon teammates based on skills, roles, and compatibility. Built with Next.js, Node.js + Express, MongoDB, and Tailwind CSS.

## Features

- **Smart Matching Algorithm:** Automatically calculates compatibility scores (up to 98%) between users based on complementary roles, shared skills, and university overlap.
- **Modern Dashboard:** High-level metrics showing available teammates and active teams, plus quick actions.
- **Discover Teammates:** Filter teammates by role and search by name or skill.
- **Create & Manage Teams:** Start your own hackathon project and invite matched users.
- **Beautiful UI:** Developed with modern design trends—glassmorphism, subtle gradients, Tailwind CSS V4, and Lucide React icons.

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on port 27017 (or a MongoDB Atlas URI)

## Setup Instructions

### 1. Database Setup
Make sure MongoDB is installed and running on your local machine. 
By default, the backend expects MongoDB to be available at:
`mongodb://127.0.0.1:27017/smart-team-finder`

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory (one is already provided) with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/smart-team-finder
   JWT_SECRET=supersecretjwtkey123
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on port 5000.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The application will be available at http://localhost:3000.*

## Troubleshooting
- **MongooseError: Operation buffering timed out:** Ensure your local MongoDB service is actively running and accessible on port `27017`.
- **CSS Issues:** Ensure you are using Tailwind V4 correctly if making custom changes to `globals.css`.
