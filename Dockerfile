FROM node:22.9.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npx prisma generate

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 4000

# CMD ["npm", "run", "start:prod"]
# CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
