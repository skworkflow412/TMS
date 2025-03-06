# Use official Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install required dependencies
RUN apk add --no-cache git

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Expose the application's port (change if necessary)
EXPOSE 3000

# Command to run the app
CMD ["node", "src/server.js"]
