FROM cruizba/ubuntu-dind:jammy-24.0.7 as builder

USER root
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt -y upgrade

# Need curl for healthchecks
# The file binary is used to inspect exectubles when debugging container image issues
RUN apt-get -y install --no-install-recommends -y \
    gcc \
    g++ \
    cmake \
    build-essential \
    make \
    curl \
    file \
    ca-certificates \
    tzdata \
    git \
    jq \
    moreutils

ARG APP=/usr/src/app/

ENV TZ=Etc/UTC
ENV APP_USER=appuser

RUN useradd -m ${APP_USER} && \
    usermod -a -G ${APP_USER} ${APP_USER} && \
    mkdir -p ${APP}

RUN mkdir -p "${APP}/log/" && \
    chown -R $APP_USER:$APP_USER "${APP}/"

# TODO: Can we hack it together so that the whole thing works rootless?
USER ${APP_USER}
WORKDIR ${APP}

SHELL ["/bin/bash", "--login", "-i", "-c"]
# Installing NodeJS via Node Version Manager (nvm)
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

COPY --chown=${APP_USER}:${APP_USER} . .

RUN rm -rf ./examples/cacti-example-asset-bridging-backend
RUN rm -rf ./examples/cacti-example-harmonia-backend
RUN rm -rf ./examples/cacti-example-harmonia-frontend
RUN rm -rf ./examples/cacti-example-harmonia-plugin
RUN rm -rf ./examples/cactus-example-carbon-accounting-backend
RUN rm -rf ./examples/cactus-example-carbon-accounting-business-logic-plugin
RUN rm -rf ./examples/cactus-example-carbon-accounting-frontend
RUN rm -rf ./examples/cactus-example-cbdc-bridging
RUN rm -rf ./examples/cactus-example-cbdc-bridging-backend
RUN rm -rf ./examples/cactus-example-cbdc-bridging-frontend
RUN rm -rf ./examples/cactus-example-discounted-asset-trade
RUN rm -rf ./examples/cactus-example-discounted-asset-trade-client
RUN rm -rf ./examples/cactus-example-electricity-trade
RUN rm -rf ./examples/cactus-example-tcs-huawei
RUN rm -rf ./examples/cactus-workshop-examples-2022-11-14
RUN rm -rf ./examples/carbon-accounting
RUN rm -rf ./examples/test-run-transaction

RUN rm -rf ./packages/cacti-ledger-browser
RUN rm -rf ./packages/cacti-plugin-ledger-connector-stellar
RUN rm -rf ./packages/cacti-plugin-weaver-driver-fabric
RUN rm -rf ./packages/cactus-cmd-socketio-server
RUN rm -rf ./packages/cactus-plugin-bungee
RUN rm -rf ./packages/cactus-plugin-bungee-hermes
RUN rm -rf ./packages/cactus-plugin-ccmodel-hephaestus
RUN rm -rf ./packages/cactus-plugin-cc-tx-visualization
RUN rm -rf ./packages/cactus-plugin-htlc-eth-besu
RUN rm -rf ./packages/cactus-plugin-htlc-eth-besu-erc20
RUN rm -rf ./packages/cactus-plugin-keychain-aws-sm
RUN rm -rf ./packages/cactus-plugin-keychain-azure-kv
RUN rm -rf ./packages/cactus-plugin-keychain-google-sm
RUN rm -rf ./packages/cactus-plugin-keychain-memory-wasm
RUN rm -rf ./packages/cactus-plugin-ledger-connector-aries
RUN rm -rf ./packages/cactus-plugin-ledger-connector-cdl
RUN rm -rf ./packages/cactus-plugin-ledger-connector-corda
RUN rm -rf ./packages/cactus-plugin-ledger-connector-ethereum
RUN rm -rf ./packages/cactus-plugin-ledger-connector-go-ethereum-socketio
RUN rm -rf ./packages/cactus-plugin-ledger-connector-iroha
RUN rm -rf ./packages/cactus-plugin-ledger-connector-iroha2
RUN rm -rf ./packages/cactus-plugin-ledger-connector-polkadot
RUN rm -rf ./packages/cactus-plugin-ledger-connector-sawtooth
RUN rm -rf ./packages/cactus-plugin-ledger-connector-tcs-huawei-socketio
RUN rm -rf ./packages/cactus-plugin-ledger-connector-ubiquity
RUN rm -rf ./packages/cactus-plugin-ledger-connector-xdai
RUN rm -rf ./packages/cactus-plugin-persistence-ethereum
RUN rm -rf ./packages/cactus-plugin-persistence-fabric
RUN rm -rf ./packages/cactus-plugin-satp-hermes
RUN rm -rf ./packages/cactus-test-api-client
RUN rm -rf ./packages/cactus-test-cmd-api-server
RUN rm -rf ./packages/cactus-test-geth-ledger
RUN rm -rf ./packages/cactus-test-plugin-consortium-manual
RUN rm -rf ./packages/cactus-test-plugin-htlc-eth-besu
RUN rm -rf ./packages/cactus-test-plugin-htlc-eth-besu-erc20
RUN rm -rf ./packages/cactus-test-plugin-keychain-memory
RUN rm -rf ./packages/cactus-test-plugin-ledger-connector-besu
RUN rm -rf ./packages/cactus-test-plugin-ledger-connector-ethereum
RUN rm -rf ./packages/cactus-test-plugin-ledger-connector-quorum
RUN rm -rf ./packages/cactus-test-verifier-client
RUN rm -rf ./packages/cactus-verifier-client

RUN rm -rf weaver/


RUN source ~/.bashrc && \
    nvm install 18.18.2

RUN source ~/.bashrc && \
    npm i -g corepack@0.28.2 && corepack enable && corepack prepare yarn@4.3.1 --activate

RUN source ~/.bashrc && \
    npm run init-registries

RUN source ~/.bashrc && \
    yarn install

RUN source ~/.bashrc && \
    yarn run tsc ./examples/cactus-example-supply-chain-backend/tsconfig.json

RUN source ~/.bashrc && \
    NODE_OPTIONS="--max_old_space_size=3072" yarn lerna run build:dev:frontend --scope='@hyperledger/cactus-example-supply-chain-frontend'

RUN source ~/.bashrc && \
    yarn workspaces focus @hyperledger/cactus-example-supply-chain-backend --production

RUN rm -rf .yarn/cache/
RUN rm -rf .yarn/cache/
RUN rm -rf docs
RUN rm -rf docs-cactus
RUN rm -rf tools
RUN rm -rf examples/cactus-example-supply-chain-frontend/.angular/cache/
RUN rm -rf examples/cactus-example-supply-chain-frontend/node_modules/

RUN source ~/.bashrc && \
    npm i -g @vercel/ncc

RUN source ~/.bashrc && \
    ncc build \
        ./examples/cactus-example-supply-chain-backend/dist/lib/main/typescript/supply-chain-app-cli.js \
        --out=./dist/ncc/ \
        --external fabric-common \
        --external fabric-ca-client \
        --external fabric-network

USER root
RUN mv ./dist/ncc /opt/cacti/
RUN chown -R ${APP_USER}:${APP_USER} /opt/cacti/


FROM cruizba/ubuntu-dind:jammy-24.0.7 as runner

USER root

ARG APP=/usr/src/app/

ENV TZ=Etc/UTC
ENV APP_USER=appuser

RUN useradd -m ${APP_USER} && \
    usermod -a -G ${APP_USER} ${APP_USER} && \
    mkdir -p ${APP}

RUN mkdir -p "${APP}/log/" && \
    chown -R $APP_USER:$APP_USER "${APP}/"

USER ${APP_USER}
SHELL ["/bin/bash", "--login", "-i", "-c"]    
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash 

RUN source ~/.bashrc && \
    nvm install 18.18.2
    
COPY --from=builder --chown=${APP_USER}:${APP_USER} ${APP}examples/cactus-example-supply-chain-frontend/www ${APP}examples/cactus-example-supply-chain-frontend/www 
COPY --from=builder --chown=${APP_USER}:${APP_USER} /opt/cacti /opt/cacti
COPY examples/cactus-example-supply-chain-backend/supervisord.conf /etc/supervisord.conf

WORKDIR /opt/cacti/
RUN source ~/.bashrc && \
        npm i fabric-common fabric-network fabric-ca-client
    
# COPY --from=builder --chown=${APP_USER}:${APP_USER} ${APP} /usr/src/app
# COPY examples/cactus-example-supply-chain-backend/supervisord.conf /etc/supervisord.conf
# COPY --chown=${APP_USER}:${APP_USER} ./examples/cactus-example-supply-chain-backend/healthcheck.sh /


ENV AUTHORIZATION_CONFIG_JSON="{}"
ENV AUTHORIZATION_PROTOCOL=NONE
ENV COCKPIT_WWW_ROOT=/usr/src/app/examples/cactus-example-supply-chain-frontend/www/
ENV COCKPIT_TLS_ENABLED=false
ENV COCKPIT_CORS_DOMAIN_CSV=\*
ENV COCKPIT_MTLS_ENABLED=false
ENV COCKPIT_TLS_CERT_PEM=-
ENV COCKPIT_TLS_KEY_PEM=-
ENV COCKPIT_TLS_CLIENT_CA_PEM=-
ENV COCKPIT_HOST=0.0.0.0
ENV COCKPIT_PORT=3000
ENV API_MTLS_ENABLED=false
ENV API_TLS_ENABLED=false
ENV API_CORS_DOMAIN_CSV=\*
ENV API_TLS_CERT_PEM=-
ENV API_TLS_CLIENT_CA_PEM=-
ENV API_TLS_KEY_PEM=-
ENV API_HOST=0.0.0.0
ENV API_PORT=4000
ENV GRPC_TLS_ENABLED=false
ENV LOG_LEVEL=TRACE

USER root

# Extend the parent image's entrypoint
# https://superuser.com/questions/1459466/can-i-add-an-additional-docker-entrypoint-script
ENTRYPOINT ["/usr/bin/supervisord"]
CMD ["--configuration", "/etc/supervisord.conf", "--nodaemon"]
HEALTHCHECK --interval=1s --timeout=5s --start-period=120s --retries=250 \
    CMD /usr/src/app/examples/cactus-example-supply-chain-backend/healthcheck.sh
