# Dockerfile for Koyeb deployment
FROM node:18-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

CMD ["node", "src/server.js"]
