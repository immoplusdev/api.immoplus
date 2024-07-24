###################
# CONFIGURATION
###################

ARG NODE_VERSION=20.12.2

###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:${NODE_VERSION} As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# RUN npm ci
RUN npm i --force

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:${NODE_VERSION} As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

# ENV NODE_ENV production
ENV NODE_ENV development

# RUN npm ci --only=production && npm cache clean --force
RUN npm i --force
RUN npm uninstall bcrypt --force
RUN npm install bcrypt --force

USER node

###################
# PRODUCTION
###################

FROM node:${NODE_VERSION} As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
# COPY --chown=node:node --from=build /usr/src/app/src ./src

EXPOSE 3000

CMD [ "node", "dist/main.js" ]