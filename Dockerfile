FROM node:lts-alpine

RUN apk add git

WORKDIR /usr/src/fogofwarchess/build

COPY ./fowc-lib /usr/src/fogofwarchess/fowc-lib
COPY ./build/package*.json ./

RUN npm i

COPY ./build .

CMD ["node", "server.js"]
