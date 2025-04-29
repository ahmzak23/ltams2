# Stage 1: Build the Angular application
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps to handle conflicts
RUN npm install --legacy-peer-deps

# Copy the entire project
COPY . .

# Build the application with the correct output path
RUN mkdir -p logs

# Expose port 4200 (matches docker-compose.yml)
EXPOSE 4200

# Start Nginx
CMD ["npm", "start"] 