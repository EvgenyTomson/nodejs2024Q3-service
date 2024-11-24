FROM node:22.9.0-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm ci

RUN npx prisma generate

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]