FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install bash -y \
    && apt-get install git -y \
    && apt-get install curl -y \
    && apt-get install python3-minimal -y \
    && curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install nodejs -y \
    && mkdir -p /usr/restarternator \
    && adduser -u 1000 restarternator \
    && chmod 700 -R /usr/restarternator \
    && chown -R restarternator /usr/restarternator

COPY ./.stage/src/. /usr/restarternator

USER restarternator

CMD cd /usr/restarternator && npm start