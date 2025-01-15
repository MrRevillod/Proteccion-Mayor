
# ------------ BASE IMAGE --------------

FROM node:22.13.0-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ------------ BUILD STAGE --------------

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm --filter=database run db:generate
RUN pnpm run build:packages

RUN pnpm deploy --filter=auth --prod /prod/auth
RUN pnpm deploy --filter=dashboard --prod /prod/dashboard
RUN pnpm deploy --filter=storage --prod /prod/storage

# ------------ AUTH SERVICE IMAGE --------------

FROM base AS auth

COPY --from=build /prod/auth /prod/auth
WORKDIR /prod/auth

EXPOSE 3000

CMD [ "pnpm", "start" ]

# ------------ DASHBOARD SERVICE IMAGE --------------

FROM base AS dashboard

COPY --from=build /prod/dashboard /prod/dashboard
WORKDIR /prod/dashboard

EXPOSE 4000

CMD [ "pnpm", "start" ]

# ------------ STORAGE SERVICE IMAGE --------------

FROM base AS storage

COPY --from=build /prod/storage /prod/storage
WORKDIR /prod/storage

EXPOSE 5000

CMD [ "pnpm", "start" ]

# ------------ DATABASE SEEDING IMAGE --------------

FROM base AS seed

COPY .env /usr/src/app/packages/database/.env

COPY --from=build /usr/src/app/packages/database /usr/src/app/packages/database
WORKDIR /usr/src/app/packages/database

CMD [ "pnpm", "run", "db:seed:dev" ]

# ------------ WEB APP && NGINX IMAGE --------------

FROM node:22.13.0-alpine AS web-build

WORKDIR /usr/src/app

COPY ./apps/web /usr/src/app

RUN pnpm install
RUN pnpm run build

FROM nginx:alpine

COPY --from=web-build /usr/src/app/dist /var/www/pmtemuco

COPY nginx.prod.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
