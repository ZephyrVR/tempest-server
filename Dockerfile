FROM node:boron

RUN mkdir -p /app

RUN npm install nodemon -g

WORKDIR /app

ADD package.json /app/package.json
RUN npm install