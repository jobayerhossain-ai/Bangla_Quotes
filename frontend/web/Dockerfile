FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY frontend/web/package*.json ./frontend/web/
RUN npm ci
COPY frontend/web ./frontend/web
WORKDIR /app/frontend/web
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/frontend/web/package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/frontend/web/.next ./.next
COPY --from=builder /app/frontend/web/public ./public
EXPOSE 3000
CMD ["npm", "start"]
