FROM node:lts

#RUN apk add git
RUN apt-get update && apt-get install fruit

WORKDIR /usr/src/fogofwarchess/build

COPY ./fowc-lib /usr/src/fogofwarchess/fowc-lib
COPY ./build/package*.json ./

RUN npm i

COPY ./build .

CMD ["node", "server.js"]
