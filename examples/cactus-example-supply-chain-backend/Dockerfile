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

RUN source ~/.bashrc && \
    nvm install 18.18.2

RUN source ~/.bashrc && \
    npm i -g corepack@0.28.2 && corepack enable && corepack prepare yarn@4.3.1 --activate

RUN source ~/.bashrc && \
    npm run init-registries

RUN source ~/.bashrc && \
    yarn install

RUN source ~/.bashrc && \
    npm run configure

RUN source ~/.bashrc && \
    yarn build:dev

RUN source ~/.bashrc && \
    yarn workspaces focus @hyperledger/cactus-example-supply-chain-backend --production

SHELL ["/bin/bash", "--login", "-c"]


COPY --chown=${APP_USER}:${APP_USER} ./examples/cactus-example-supply-chain-backend/healthcheck.sh /

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

COPY examples/cactus-example-supply-chain-backend/supervisord.conf /etc/supervisord.conf

# supervisord web ui/dashboard
EXPOSE 9001
# API #1
EXPOSE 4000
# API #2
EXPOSE 4100
# GUI #1
EXPOSE 3000
# GUI #2
EXPOSE 3100
# API #3
EXPOSE 4200
# GUI #3
EXPOSE 3200

# USER root
# RUN mkdir -p /opt/cacti/examples/supply-chain-app/
# RUN chown -R ${APP_USER}:${APP_USER} /opt/cacti
# USER ${APP_USER}

# SHELL ["/bin/bash", "--login", "-i", "-c"]

# WORKDIR /usr/src/app/examples/cactus-example-supply-chain-backend/
# RUN source ~/.bashrc && npm pack --pack-destination=/opt/cacti/examples/supply-chain-app/

# WORKDIR /usr/src/app/examples/cactus-example-supply-chain-frontend/
# RUN source ~/.bashrc && npm pack --pack-destination=/opt/cacti/examples/supply-chain-app/

# WORKDIR /opt/cacti/examples/supply-chain-app/
# RUN source ~/.bashrc &&npm i $(find . -maxdepth 1 -type f -iname "hyperledger-cactus-example-supply-chain-backend*.tgz" | head -1)
# RUN source ~/.bashrc &&npm i $(find . -maxdepth 1 -type f -iname "hyperledger-cactus-example-supply-chain-frontend-*.tgz" | head -1)

# ENV COCKPIT_WWW_ROOT=/opt/cacti/examples/supply-chain-app/node_modules/@hyperledger/cactus-example-supply-chain-frontend/www/

# RUN rm -rf /usr/src/app/*
# RUN mkdir -p /usr/src/app/log/
# USER root

# RUN rm -rf /var/cache/apt/archives /var/lib/apt/lists


RUN rm -rf examples/cactus-example-carbon-accounting-*
RUN rm -rf examples/cactus-example-cbdc-bridging*
RUN rm -rf weaver/
RUN rm -rf packages/cactus-plugin-htlc-eth-besu/
RUN rm -rf packages/cactus-plugin-htlc-eth-besu-erc20
RUN rm -rf examples/cactus-example-supply-chain-frontend/.angular/cache/
RUN rm -rf .yarn/cache/
RUN rm -rf examples/cactus-example-supply-chain-frontend/node_modules/  

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

COPY --from=builder --chown=${APP_USER}:${APP_USER} ${APP} /usr/src/app
COPY examples/cactus-example-supply-chain-backend/supervisord.conf /etc/supervisord.conf
COPY --chown=${APP_USER}:${APP_USER} ./examples/cactus-example-supply-chain-backend/healthcheck.sh /


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
