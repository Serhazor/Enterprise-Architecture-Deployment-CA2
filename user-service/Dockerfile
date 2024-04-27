# Base Image
# Build Stage
FROM node:16 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install

# Runtime Stage
FROM node:16-slim AS runtime-stage
WORKDIR /app
COPY --from=build-stage /app/node_modules /app/node_modules
COPY . . 
EXPOSE 8081
CMD ["node", "index.js"] 


# Working Directory
WORKDIR /app

# Copy Dependency Files
COPY package*.json ./

# Install Dependencies
RUN npm install 

# Copy Application Code
COPY . . 

# Expose the Port
EXPOSE 8081  

# Install build tools, rebuild bcrypt, and remove build tools
RUN apt-get update && \
    apt-get install -y build-essential python2 g++ make && \
    npm rebuild bcrypt --build-from-source && \
    apt-get purge -y build-essential python2 g++ make && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Start the Application
CMD ["node", "index.js"]
