FROM node:12

MAINTAINER junho <alaldlftlr1229@gmail.com>

WORKDIR /usr/scr/app

COPY package*.json ./

COPY . .

EXPOSE 3002

CMD ["node", "app.js"]

