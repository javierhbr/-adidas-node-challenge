FROM mhart/alpine-node:14 as builder
#USER node
WORKDIR /app

ENV NPM_CONFIG_LOGLEVEL warn
COPY package*.json ./

RUN npm install && npm cache clean --force
COPY . .
RUN npm run build
# remove development dependencies
RUN npm prune --production

# stage 2
FROM node:14-alpine
#USER node
ENV NODE_ENV docker
WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY config ./config

EXPOSE 3000
CMD node dist/src/main.js
