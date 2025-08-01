# -----------------------
# Stage 1: Build
# -----------------------
FROM node:18-slim AS builder

WORKDIR /app

# Enable corepack and install Yarn 4.6.0
RUN corepack enable && corepack prepare yarn@4.6.0 --activate

# Copy dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy full source code
COPY . .

# Build Vite app
RUN yarn build


# -----------------------
# Stage 2: Run preview server
# -----------------------
FROM node:18-slim

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.6.0 --activate

# Copy built app from builder
COPY --from=builder /app /app

# Expose port (change if needed)
EXPOSE 3000

# Run Vite preview on host mode so EC2/IP can reach
CMD ["yarn", "preview", "--host", "--port", "3000"]
