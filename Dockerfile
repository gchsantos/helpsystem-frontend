FROM node:18.16

COPY .  /app 

WORKDIR /app

RUN npm i
