FROM node:14-alpine
LABEL maintainer="pman89@ya.ru"

ENV NODE_ENV "production"

ENV PORT 8080
EXPOSE 8080

WORKDIR /api

COPY package*.json ./
COPY yarn.lock ./

RUN apk add --no-cache --virtual .gyp python make g++ \
    && yarn install --production=true --non-interactive --frozen-lockfile \
    && apk del .gyp

COPY . .

RUN yarn build

RUN chown -R node:node /api

USER node

CMD ["npm", "start"]


