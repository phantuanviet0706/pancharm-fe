# Step 1: Build Vite app
FROM node:18-alpine AS builder

RUN corepack enable

RUN corepack prepare yarn@4.6.0 --activate

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

COPY .yarn .yarn

RUN yarn install

COPY . .

RUN yarn build

# Step 2: Serve with nginx
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]