# Base image with Node.js 18
FROM node:18-slim

# Set working directory
WORKDIR /app

# Enable corepack and activate Yarn 4.6.0
RUN corepack enable \
  && corepack prepare yarn@4.6.0 --activate

# Copy project files
COPY . .

# Install dependencies
RUN yarn install

# (Optional) Build your app if needed
# RUN yarn build

# Default command
CMD ["yarn", "start"]
