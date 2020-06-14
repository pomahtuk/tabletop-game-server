FROM node:14

LABEL maintainer="pman89@ya.ru"

ARG PORT=8080
ENV PORT ${PORT}

EXPOSE ${PORT}

RUN mkdir /api
RUN groupadd -r apiuser && useradd -r -s /bin/false -g apiuser apiuser
WORKDIR /api

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --production=true --non-interactive --frozen-lockfile

COPY . .

RUN yarn build

RUN chown -R apiuser:apiuser /api

USER apiuser

CMD ["npm", "start"]


