FROM node:20-alpine
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate && pnpm build
CMD ["pnpm", "start:prod"]
EXPOSE 3001