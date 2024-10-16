# Use Node.js as the base image
FROM node:22-alpine

# Set the working directory for the container
WORKDIR /app

# Copy package.json and package-lock.json for both the backend and frontend
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install all dependencies for both backend and frontend
RUN npm install && npm install --prefix frontend

# Copy all source code for both backend and frontend
COPY . .

# Copy .env.production for both backend and frontend
COPY .env.production .env
COPY frontend/.env.production frontend/.env

# Build the backend and frontend using your defined scripts
RUN npm run build

# Expose the backend port
EXPOSE 3100

# Start the backend server
CMD ["npm", "run", "start:prod"]
