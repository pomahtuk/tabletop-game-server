FROM node:16-alpine as builder

RUN apk add --no-cache --virtual .gyp python3 make g++

WORKDIR /build

COPY package*.json yarn.lock tsconfig.json .npmrc ormconfig.js ./
RUN yarn install --frozen-lockfile --non-interactive --production=false

COPY src ./src
RUN yarn build

RUN rm -rf node_modules
RUN yarn install --frozen-lockfile --non-interactive --production=true

RUN apk del .gyp


FROM node:16-alpine
LABEL maintainer="pman89@ya.ru"

ENV NODE_ENV "production"

ENV PORT 8080
EXPOSE 8080

WORKDIR /api

COPY --from=builder /build/node_modules node_modules
COPY --from=builder /build/dist dist
COPY --from=builder /build/package*.json .

RUN chown -R node:node /api

USER node

CMD ["npm", "start"]


