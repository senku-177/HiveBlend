# Use the Node.js base image for building and serving the React app
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of your application
COPY . .

# Build the React app
RUN npm run build

# Expose port 3000 (default port for create-react-app)
EXPOSE 3000

# Command to run the React app
CMD ["npm", "start"]
