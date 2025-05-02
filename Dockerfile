FROM node:23-slim AS base

RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  libvips-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

FROM base AS prod-deps
RUN npm ci --omit=dev

FROM base AS build
COPY . .
RUN npm ci
RUN npm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

COPY . .

EXPOSE 8000
CMD [ "npm", "run", "start:dev" ]
