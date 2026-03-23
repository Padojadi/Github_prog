# Stage 1: Build
FROM --platform=linux/amd64 node:22.14.0-alpine AS builder

WORKDIR /app

# Copy workspace root config
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/package.json

# Copy app package and prisma schema
COPY apps/conferences/package.json ./apps/conferences/package.json
COPY apps/conferences/prisma ./apps/conferences/prisma/

# Install all workspace dependencies
RUN npm ci --workspace=apps/conferences --workspace=packages/shared --include-workspace-root

# Copy shared package source and build it
COPY packages/shared ./packages/shared
COPY tsconfig.base.json ./
RUN npm run build -w packages/shared

# Generate Prisma client
RUN npx prisma generate --schema=apps/conferences/prisma/schema.prisma

# Copy app source
COPY apps/conferences/src ./apps/conferences/src/
COPY apps/conferences/tsconfig*.json ./apps/conferences/
COPY apps/conferences/nest-cli.json ./apps/conferences/

# Build the app
RUN npm run build -w apps/conferences

# Stage 2: Production
FROM --platform=linux/amd64 node:22.14.0-alpine

WORKDIR /app

# Copy workspace root config
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/conferences/package.json ./apps/conferences/package.json

# Install production dependencies only
RUN npm ci --workspace=apps/conferences --workspace=packages/shared --include-workspace-root --omit=dev

# Copy shared dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

# Copy built app and Prisma client
COPY --from=builder /app/apps/conferences/dist ./apps/conferences/dist/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

WORKDIR /app/apps/conferences

EXPOSE 5003

CMD ["node", "dist/main"]
