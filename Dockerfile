FROM node/14-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY . /usr/src/app/
CMD [ "node", "./src/index.js" ]