# syntax = docker/dockerfile:1

# Set Node.js version
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Build stage to install dependencies
FROM base AS build

# Install packages needed for native modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package-lock.json package.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Final stage for runtime image
FROM base

# Copy app from build stage
COPY --from=build /app /app

# Expose the port your server listens on (match server.js)
EXPOSE 8080

# Start the server
CMD ["npm", "run", "start"]
