# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/admin/package*.json ./frontend/admin/

# Install dependencies
RUN npm ci

# Copy source code
COPY frontend/admin ./frontend/admin

# Build application
WORKDIR /app/frontend/admin
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY --from=builder /app/frontend/admin/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/frontend/admin/.next ./.next
COPY --from=builder /app/frontend/admin/public ./public

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]
