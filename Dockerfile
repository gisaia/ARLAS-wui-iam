### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:24.2.0 AS builder
WORKDIR /app

COPY ./package.json  ./
COPY ./package-lock.json  ./

## installing necessary libraries
RUN npm install --ignore-scripts && npm run postinstall

COPY ./scripts/start.sh ./

COPY . .

## Build the angular app in production mode
RUN npm run build

### STAGE 2: Setup ###

FROM nginx:1.29-alpine3.23-slim
ARG version="latest"

LABEL io.arlas.wui-iam.version=${version}
LABEL vendor="Gisaïa"
LABEL description="This container build and serve the ARLAS-wui-iam app"

RUN apk add --no-cache --update bash jq netcat-openbsd curl && rm -rf /var/cache/apk/* && apk add 'zlib==1.3.2-r0'

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /app/dist/arlas-wui-iam /usr/share/nginx/html
COPY --from=builder /app/start.sh /usr/share/nginx/

HEALTHCHECK CMD curl --fail http://localhost:8080/ || exit 1

CMD ["/usr/share/nginx/start.sh"]
