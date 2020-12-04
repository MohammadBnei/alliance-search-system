FROM node:15-alpine


WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm i -g nodemon
RUN npm install --silent
CMD nodemon src/index.js
