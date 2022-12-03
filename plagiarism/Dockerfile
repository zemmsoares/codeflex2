
FROM frolvlad/alpine-glibc

RUN apk add --update nodejs npm

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8082
CMD [ "node", "server.js" ]