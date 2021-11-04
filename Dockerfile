FROM node:slim as build-stage

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY ./ ./

USER node

RUN npm install

FROM boblancer/zipmex-build as test-stage
CMD npm test