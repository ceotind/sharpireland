# Multi-stage build for Sharp Ireland Next.js application
# Stage 1: Builder
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with retry logic
RUN for i in 1 2 3; do \
      npm ci --only=production=false && break || \
      if [ $i -eq 3 ]; then exit 1; else sleep 10; fi; \
    done

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production - Use Alpine for compatibility
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Install dependencies needed for runtime
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Ensure proper permissions
RUN chown -R nextjs:nodejs ./

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set environment variables (removed NODE_ENV)
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]