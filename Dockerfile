FROM node:14

LABEL maintainer="pman89@ya.ru"

EXPOSE 8080

# set the argument default
ARG NODE_ENV=production
ARG PORT=8080

# assign it to an environment variable
# we can wrap the variable in brackets
ENV NODE_ENV ${NODE_ENV}
ENV SMTP_HOST ${SMTP_HOST}
ENV SMTP_PORT ${SMTP_PORT}
ENV SMTP_SECURE ${SMTP_SECURE}
ENV SMTP_USER ${SMTP_USER}
ENV SMTP_PASS ${SMTP_PASS}
ENV PORT ${PORT}

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


