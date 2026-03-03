###################
# ARGUMENTS GLOBAUX
###################
ARG NODE_VERSION=20.12.2

###################
# BUILD STAGE POUR LE DEV
###################
FROM node:${NODE_VERSION} AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install --force

COPY --chown=node:node . .

USER node

###################
# BUILD STAGE POUR LA COMPILATION
###################
FROM node:${NODE_VERSION} AS build

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*

COPY --chown=node:node package*.json ./
RUN npm install --force

COPY --chown=node:node . .

RUN npm run build

# Vérifier que le build a bien créé le fichier main.js
RUN ls -la dist/src/ && test -f dist/src/main.js

# Gestion spécifique pour bcrypt si besoin
RUN npm uninstall bcrypt --force && npm install bcrypt --force

ENV NODE_ENV=production

###################
# IMAGE FINALE POUR PROD
###################
FROM node:${NODE_VERSION} AS production

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY views ./views
COPY public ./public


ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
