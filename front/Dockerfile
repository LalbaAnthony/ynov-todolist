# Use official Node.js image as base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if exists)
COPY front/package*.json ./

# Install the dependencies
RUN npm install

# Copy the entire frontend project to the container
COPY front/ .

# Build the Vue.js project
RUN npm run build

# Expose the port that your app will run on (default Vue.js dev server runs on 8080)
EXPOSE 8080

# Command to run the app
CMD ["npm", "run", "serve"]
