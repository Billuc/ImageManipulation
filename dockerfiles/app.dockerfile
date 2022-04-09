FROM node:17 as base

WORKDIR /app

COPY ./app/package.json ./package.json
COPY ./app/package-lock.json ./package-lock.json

RUN npm install

FROM base as svelte

ENTRYPOINT [ "npm", "run", "dev" ]