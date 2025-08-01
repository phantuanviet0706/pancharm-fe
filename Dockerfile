# Base image with Node.js 18
FROM node:18-slim AS builder

# Set working directory
WORKDIR /app

# Enable corepack and activate Yarn 4.6.0
COPY package.json yarn.lock ./
RUN corepack enable \
  && corepack prepare yarn@4.6.0 --activate
RUN yarn install

# Copy project files
COPY . .
RUN yarn build

FROM node:18-slim

WORKDIR /app

COPY --from=builder /app /app

RUN corepack enable && corepack prepare yarn@4.6.0 --activate

EXPOSE 3000

# Default command
CMD ["yarn", "preview", "--host", "--port", "3000"]
