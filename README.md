# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone git@github.com:EvgenyTomson/nodejs2024Q3-service.git
```

## Install Docker if needed

You will need [docker-desktop](https://www.docker.com/products/docker-desktop/) if you use Windows or MacOs as your host OS.

## Setting up the Environment

Use .env.example to create .env file with PORT and DATABASE_URL in it.

## Start docker-desktop on your host machine

## Run docker containers

For the first time:

```
docker-compose up --build
```

For other times:

```
docker-compose up
```

## Wait until docker container and application in it starts

You will see log like this:

```
app-1       | [Nest] 35  - 11/17/2024, 10:52:51 AM     LOG [NestApplication] Nest application successfully started +215ms
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## For running application on host mahine

1. Run database container

```
docker-compose up -d database
```

2. Change DATABASE_URL in your .env file to one "For app rinning on host machine" (see .env.example)

3. Install NPM modules

```
npm ci
```

4. Generate Prisma client

```
npx prisma generate
```

5. Start application on your host machine

```
npm run start:dev
```

or

```
npm run build
npm start
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

## To stop contaibers use

```
docker-compose down
```

## To reset database in app container (or host machine depends on where do you run app) use

```
npx prisma migrate reset
```

## To complete migration in app container (or host machine depends on where do you run app) use

```
npx prisma migrate dev --name mymigration
```
