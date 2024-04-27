# Specify a base Node.js image
FROM node:16-alpine 

# Create a working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if you have one)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy your application source code 
COPY . . 

# Expose the port your application listens on
EXPOSE 8080 

# Command to start your application
CMD [ "node", "index.js" ] 
