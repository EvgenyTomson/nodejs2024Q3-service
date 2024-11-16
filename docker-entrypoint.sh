#!/bin/sh

echo "Running Prisma Migrations..."
npx prisma migrate deploy

echo "Generating Prisma Client..."
npx prisma generate

echo "Starting the application..."
npm run start:prod
