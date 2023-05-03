FROM alpine:3.15 AS build
RUN apk --no-cache add \
    make \
    npm
RUN apk --no-cache \
    --repository http://dl-3.alpinelinux.org/alpine/edge/testing/ add \
    pandoc
ARG NODE_ENV=production
WORKDIR /build
COPY . ./
RUN make

FROM alpine:3.14
RUN apk --no-cache add \
    nginx \
    nginx-mod-http-lua
WORKDIR /app
COPY --from=build /build/build/web ./
COPY docker-nginx.conf /etc/nginx/nginx.conf
COPY docker-entrypoint.sh ./
EXPOSE 80
ENTRYPOINT ["./docker-entrypoint.sh"]
