FROM node:15-alpine

RUN apk add --no-cache yarn

WORKDIR /app
COPY ["package.json","yarn.lock", "./"]
RUN yarn
CMD yarn start
