# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm, curl, and prisma
RUN apk add --no-cache curl && \
    npm install -g pnpm prisma

# Copy package files and prisma schema
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --force

# Copy source code
COPY . .

# Generate Prisma client and build
RUN pnpm prisma generate && pnpm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install pnpm, curl, and prisma
RUN apk add --no-cache curl && \
    npm install -g pnpm prisma

# Copy package files and prisma schema
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install production dependencies
RUN pnpm install --prod --force

# Copy built code and generated Prisma client from build stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Generate Prisma client in production
RUN pnpm prisma generate

# Expose port and add healthcheck
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1

# Run migrations and start the app
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/app.js"]
