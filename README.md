#Task Manager Backend
Overview
The Task Manager backend is a RESTful API built with Node.js and Express.js that allows users to manage their tasks efficiently. Users can create, read, update, and delete tasks, as well as register and log in to their accounts.

Features
User authentication (registration and login)
CRUD operations for tasks
Secure API endpoints with JWT authentication
Responsive and scalable architecture

Technologies Used
Node.js
Express.js
PostgreSQL
Sequelize
JSON Web Tokens (JWT) for authentication
dotenv for environment variable management

Getting Started
Prerequisites
Node.js (v14 or higher)
PostgreSQL
npm (Node Package Manager)

Installation
Create a .env file in the root directory and add the following environment variables:
DB_NAME=task_manager
DB_USER=postgres
DB_PASS=123456789
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=secret_key

npm install

Running the Application
npm start
The API will be running on http://localhost:5000

API Endpoints
Authentication
POST /api/auth/register

Register a new user.
Request body: { "username": "max", "email": "max@mail.com", "password": "Max@123" }
POST /api/auth/login

Log in an existing user.
Request body: { "email": "max@mail.com", "password": "Max@123" }
Tasks
GET /api/tasks

Retrieve all tasks for the authenticated user.
Requires JWT authentication.
POST /api/tasks

Create a new task.
Request body: { "title": "Car wash", "description": "The description for car wash", "status": "TODO" }
Requires JWT authentication.
PUT /api/tasks/:id

Update an existing task by ID.
Request body: { "title": "Car wash", "description": "The description for car wash", "status": "TODO" }
Requires JWT authentication.
DELETE /api/tasks/:id

Delete a task by ID.
Requires JWT authentication.

Testing
You can use tools like Postman or Insomnia to test the API endpoints. Make sure to include the JWT token in the Authorization header for protected routes.
