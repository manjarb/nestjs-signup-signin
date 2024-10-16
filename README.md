## Project Overview

A full-stack web service and client application for user authentication, including signup and signin functionality. Built using NestJS and MongoDB for the backend, and React with Vite and Material-UI (MUI) for the frontend, this project allows users to register, sign in, and access a secure application page. All data is managed via a RESTful API and persisted in a MongoDB database. The application can be easily deployed using Docker.

## Table of Contents

- [Project Overview](#project-overview)
- [Running the Service Using Docker](#running-the-service-using-docker)
- [Running the Application Locally Without Docker](#running-the-application-locally-without-docker)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [User Authentication](#user-authentication)
    - [Sign Up](#sign-up)
    - [Sign In](#sign-in)
  - [Swagger Documentation](#swagger-documentation)
- [Future Improvements](#future-improvements)
- [Considerations](#considerations)

### Prerequisites

- **Docker**: Ensure that Docker is installed and running on your machine.
- **Node.js & npm**: Needed for local development.

### Technologies Used

- **Backend**: NestJS, MongoDB, Mongoose
- **Frontend**: React, Vite, Material-UI (MUI)
- **Testing**: Jest, React Testing Library, Vitest
- **Other Tools**: Docker, TypeScript, Jotai

### Environment Variables

You will need to set up environment variables for the server and client. Below are the steps for different environments:

1. **Local Development Environment**:
  - Create an `.env` file in the root directory by copying `.env.sample`
  - Create an `.env` file in the `frontend` directory by copying `.env.sample`

These environment files will be used for local development.

2. **Docker Production Environment**:
- To build and run the Docker image, you will need to set up environment variables for production as well:
  - Create a `.env.production` file in the root directory by copying `.env.sample`.
  - Create a `.env.production` file in the `frontend` directory by copying `frontend/.env.sample`.

These `.env.production` files will be used during the Docker image build process to ensure the Docker container uses the correct environment variables.

### Running the Service Using Docker

1. **Build the Docker Image**
```Bash
docker compose up --build
```

This command will build a Docker image with the necessary server and client files and start the application services.

2. **Run the Docker Container**
```Bash
docker compose up
```

This command will start the container, exposing the application on port `3100`.

3. **Access the Application**
- Once the container is running, you can access the API and client through the following URLs:
  - **API**: `http://localhost:3100/api/v1`
  - **Client**: `http://localhost:3100`
  - **Swagger Documentation**: `http://localhost:3100/api-docs`

### Running the Application Locally Without Docker

1. **Install Server and Client Dependencies**
- Navigate to the root of the project and run:
```bash
npm install
```

- Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend && npm install
```

2. **Run the Client and Server in Development Mode**
- Run Application for both Front End and Back End concurrently:
```bash
npm run dev
```

3. **Access the Application**
- Server: `http://localhost:3100`
- Client: `http://localhost:5173`

## API Endpoints

### Health Check

**GET** `/health-check`

Returns the health status of the server.
```
curl -X GET http://localhost:3100/health-check
```

**Sample Response**
```
Hello World!
```

### User Authentication

### Sign Up

**POST** `/api/v1/auth/signup`

Request Body (JSON)
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "Password123!"
}
```

**Sample Response**
```json
{
  "data": {
    "user": {
      "name": "John Doe",
      "email": "johndoe13@example.com",
      "password": "$2b$10$zi4LG0Wd6qssTxmhwfr3IelODLcX7lFiMRxSGx4efl.oPaEECIseW",
      "role": "user",
      "_id": "670f052e07b5a087ed644bb7",
      "createdAt": "2024-10-16T00:13:34.894Z",
      "updatedAt": "2024-10-16T00:13:34.894Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzBmMDUyZTA3YjVhMDg3ZWQ2NDRiYjciLCJlbWFpbCI6ImpvaG5kb2UxM0BleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzI5MDM3NjE0LCJleHAiOjE3MjkwMzg1MTR9.9QA5aHVAQdQLg8NgMqWxR7R_nHgIULVAIH2YwpwrrUg",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzBmMDUyZTA3YjVhMDg3ZWQ2NDRiYjciLCJpYXQiOjE3MjkwMzc2MTQsImV4cCI6MTcyOTY0MjQxNH0.kAT6LCkryi-o-EEHqCSaiIAx9ABktk4Nlomkzr8VNik"
  },
  "timestamp": 1729037614899
}
```

### Sign In

**POST** `/api/v1/auth/signin`

Request Body (JSON)
```json
{
  "email": "johndoe@example.com",
  "password": "Password123!"
}
```


**Sample Response**
```json
{
  "data": {
    "user": {
      "_id": "670d944d9ed4e5d280a4b17c",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "role": "user",
      "createdAt": "2024-10-14T21:59:41.623Z",
      "updatedAt": "2024-10-14T21:59:41.623Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzBkOTQ0ZDllZDRlNWQyODBhNGIxN2MiLCJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcyOTAzNzU3OCwiZXhwIjoxNzI5MDM4NDc4fQ.QYErFH-BjimMlI-w2K4aJQKgS3ze90SO0uMoEbDxKLA",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzBkOTQ0ZDllZDRlNWQyODBhNGIxN2MiLCJpYXQiOjE3MjkwMzc1NzgsImV4cCI6MTcyOTY0MjM3OH0.BauU6U71_cr2B6QIaHUqoRbzpjFpwuSL377cjKYUrqM"
  },
  "timestamp": 1729037578512
}
```

### Swagger Documentation

The API is documented using Swagger. You can access the API documentation by navigating to:
http://localhost:3100/api-docs

## Future Improvements

- **Backend Enhancements**:
  - **Deployment**: Add CI/CD pipeline for seamless deployments to a hosting platform.

- **Front-End Enhancements**:
  - **Notifications**: Implement a notification system for better UX in error and success cases.
  - **Performance**: Optimize API requests and caching strategies for a smoother experience.

## Considerations

### 1. Security
- Ensure that sensitive information is never exposed to the client-side.
- Use HTTPS for production deployments.

### 2. Scalability
- The backend is designed to handle a reasonable amount of traffic, but future scaling may involve using load balancers, caching, and database optimization.

### 3. Idempotency
- Implement idempotent POST requests to prevent duplicate actions, especially for signup processes.
