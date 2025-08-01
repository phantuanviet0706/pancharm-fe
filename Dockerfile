# Step 1: Build Vite app
FROM node:18-alpine AS builder

# Enable and install yarn
RUN corepack enable && corepack prepare yarn@4.6.0 --activate

WORKDIR /app

# Copy dependency config
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

# Install dependencies
RUN yarn install --immutable

# Copy all source code
COPY . .

# Build the app
RUN yarn build

# Step 2: Serve with nginx
FROM nginx:stable-alpine

# Copy built app from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]