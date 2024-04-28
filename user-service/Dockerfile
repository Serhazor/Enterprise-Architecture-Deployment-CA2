# Base Image
FROM node:16 AS build-stage

# Set Working Directory
WORKDIR /app

# Copy Dependency Files
COPY package*.json ./

# Install Dependencies
RUN npm install

# Build Stage Complete - node_modules are ready

# Runtime Stage
FROM node:16-slim AS runtime-stage

# Set Working Directory
WORKDIR /app

# Copy node_modules from build-stage
COPY --from=build-stage /app/node_modules /app/node_modules

# Copy Application Code
COPY . .

# Expose the Port
EXPOSE 8081

# Use apt to install dependencies required for bcrypt
RUN apt-get update && \
    apt-get install -y build-essential python3 g++ make && \
    npm rebuild bcrypt --build-from-source && \
    apt-get purge -y build-essential python3 g++ make && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Start the Application
CMD ["node", "index.js"]
