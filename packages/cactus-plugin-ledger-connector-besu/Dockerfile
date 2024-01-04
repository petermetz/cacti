FROM ghcr.io/hyperledger/cactus-cmd-api-server:2024-01-02-1fb2551

ENV NODE_ENV=production
ARG NPM_PKG_VERSION=latest

RUN npm install @hyperledger/cactus-plugin-ledger-connector-besu@${NPM_PKG_VERSION}
