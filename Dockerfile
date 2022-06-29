FROM nginx:alpine

LABEL maintainer="Renan William Alves de Paula <renan@4success.com.br>"

COPY ./docker/nginx.conf /etc/nginx/
COPY ./docker/sites/ /etc/nginx/sites-available/

RUN apk update \
    && apk upgrade \
    && apk --update add logrotate \
    && apk add --no-cache openssl \
    && apk add --no-cache bash

RUN set -x ; \
    addgroup -g 82 -S www-data ; \
    adduser -u 82 -D -S -G www-data www-data && exit 0 ; exit 1

USER root

RUN rm -rf /etc/nginx/conf.d/default.conf

RUN mkdir /etc/nginx/ssl

ADD ./docker/startup.sh /opt/startup.sh
RUN sed -i 's/\r//g' /opt/startup.sh
RUN chmod +x /opt/startup.sh

ENTRYPOINT ["/opt/startup.sh"]
EXPOSE 80
