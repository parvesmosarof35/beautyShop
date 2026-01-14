FROM node:20-alpine

RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY .env.local .env.local
COPY . .

RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]