# Simplified backend Dockerfile
FROM node:22

WORKDIR /app

# Copy package.json only (not package-lock.json)
COPY package.json ./

# Clean install dependencies for the current platform (Linux)
RUN npm install

# Copy the rest of your source code
COPY . .

# Expose your app port
EXPOSE 5000

# Use npm run dev for development with tsx
CMD ["npm", "run", "dev"]
