# Expense Tracker - MERN Stack

This is a full-stack application for tracking expenses. It is built using the MERN stack (MongoDB, Express.js, React, and Node.js).

## Project Structure

The project is divided into two main parts:

- **Frontend**: Built with React, located in the `/frontend` directory.
- **Backend**: Consists of multiple microservices built with Express and Node.js, located in the `/backend` directory.

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org) (version 12 or later)
- [npm](https://www.npmjs.com)

### Installation

You need to install npm dependencies separately for both the frontend and the backend.

#### Installing Dependencies

1. **Frontend**

   Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   npm start

2. **Backend**

   Navigate to the frontend directory and install dependencies:
   ```bash
   cd backend
   cd gateway
   npm install
   npm start

   cd backend
   cd user-service
   npm install
   npm start

   cd backend
   cd expense-service
   npm install
   npm start
