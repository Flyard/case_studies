FROM node:23-alpine
WORKDIR /app/back
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install &&  npm install -g typescript

COPY . .
EXPOSE 3001
RUN npx tsc server.ts
CMD ["node", "server.js"]

