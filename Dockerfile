# ---------- Stage 1: Build ----------
FROM node:24-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

# Copy dependency files first (for caching)
COPY package.json pnpm-lock.yaml ./

# Install full dependencies (including dev)
RUN pnpm install --frozen-lockfile

# Copy source
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN pnpm build

# ---------- Stage 2: Runtime ----------
FROM node:24-alpine

WORKDIR /app

RUN corepack enable

# Copy only package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built output from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]