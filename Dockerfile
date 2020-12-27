#
# This was taken from https://wadehuang36.github.io/2019/10/27/building-docker-image-of-nodejs-with-typescript.html
#
# dockerfile
# the first image use node image as the builder because it has git program
FROM node:12 as builder
LABEL builder=true

WORKDIR /app

COPY ["./package.json", "./package-lock.json", "/app/"]

RUN npm ci

COPY "./" "/app/"

## compile typescript
RUN npm run build

## remove packages of devDependencies
RUN npm prune --production

# ===============
# the second image use node:slim image as the runtime
FROM node:14-slim as runtime

WORKDIR /app
ENV NODE_ENV=production

## Copy the necessary files form builder
COPY --from=builder "/app/out/" "/app/out/"
COPY --from=builder "/app/node_modules/" "/app/node_modules/"
COPY --from=builder "/app/package.json" "/app/package.json"

CMD ["npm", "run", "start:prod"]