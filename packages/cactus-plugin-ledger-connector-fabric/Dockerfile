FROM ghcr.io/hyperledger/cactus-cmd-api-server:2024-01-24-a33f30c

ENV DEBIAN_FRONTEND=noninteractive
USER root
RUN apt update && apt upgrade -y
USER appuser

ENV NODE_ENV=production
ARG NPM_PKG_VERSION=latest

COPY --chown=appuser:appuser ./src/container-image/package.json /usr/src/app/

RUN npm install --save-exact @hyperledger/cactus-plugin-ledger-connector-fabric@${NPM_PKG_VERSION}