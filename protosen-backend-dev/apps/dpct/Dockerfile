# Build stage
FROM --platform=linux/amd64 node:18.20.2-alpine AS builder

# Install build dependencies for native modules (argon2)
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

# Copy workspace root config
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/package.json

# Copy app package
COPY apps/dpct/package.json ./apps/dpct/package.json

# Install all workspace dependencies
RUN npm ci --workspace=apps/dpct --workspace=packages/shared --include-workspace-root

# Copy shared package source and build it
COPY packages/shared ./packages/shared
COPY tsconfig.base.json ./
RUN npm run build -w packages/shared

# Copy app source
COPY apps/dpct ./apps/dpct

# Build the app
RUN npm run build -w apps/dpct

# Production stage
FROM --platform=linux/amd64 node:18.20.2-alpine AS production

# Install build dependencies for native modules (argon2)
RUN apk add --no-cache python3 make g++

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy workspace root config
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/dpct/package.json ./apps/dpct/package.json

RUN npm pkg delete scripts.prepare --workspace=apps/dpct \
    && npm ci --workspace=apps/dpct --workspace=packages/shared --include-workspace-root --omit=dev --ignore-scripts \
    && npm rebuild argon2 --workspace=apps/dpct \
    && npm cache clean --force

# Copy shared dist
COPY --from=builder /usr/src/app/packages/shared/dist ./packages/shared/dist

# Copy built app and necessary configs
COPY --from=builder /usr/src/app/apps/dpct/build ./apps/dpct/build
COPY apps/dpct/swagger.yaml ./apps/dpct/swagger.yaml

WORKDIR /usr/src/app/apps/dpct

# Use non-root user for security
USER node

CMD ["npm", "start"]
