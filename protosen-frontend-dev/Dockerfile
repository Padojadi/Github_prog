FROM --platform=linux/amd64 node:22-alpine AS BUILD_IMAGE
WORKDIR /app

# Enable corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

# install dependencies
RUN pnpm install --frozen-lockfile

COPY . .

# build
RUN pnpm run build


FROM --platform=linux/amd64 node:20-alpine
WORKDIR /app

# Enable corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# copy from build image
COPY --from=BUILD_IMAGE /app/package.json ./package.json
COPY --from=BUILD_IMAGE /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/.next ./.next
COPY --from=BUILD_IMAGE /app/public ./public

EXPOSE 3000
CMD ["pnpm", "start"]
