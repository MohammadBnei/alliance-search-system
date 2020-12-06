FROM node:15-alpine

RUN apk add --no-cache tzdata

WORKDIR /app

COPY package.json .

RUN npm i

CMD npm start