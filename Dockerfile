# Dockerfile for Koyeb deployment
FROM node:18-alpine

WORKDIR /app
COPY ./package.json .  # Copy only package.json
RUN npm install
COPY . .

CMD ["node", "src/server.js"]
