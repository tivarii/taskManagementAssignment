# Use official Node.js LTS image
FROM node:18-alpine
# Set working directory
WORKDIR /src

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port (adjust if your backend uses a different port)
EXPOSE 4000

# Start the server
CMD ["npm", "run", "start"]
