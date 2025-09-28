FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run" ,"dev"]