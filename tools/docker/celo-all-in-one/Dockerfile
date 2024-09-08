FROM node:18.9.1-slim


RUN apt update && apt upgrade -y && apt install -y --no-install-recommends git openssh-server ca-certificates

RUN mkdir -p /opt/celo-all-in-one/
WORKDIR /opt/celo-all-in-one/

RUN npm install -g npm@9 && \
    npm install --save-dev --save-exact @celo/celo-devchain @celo/contractkit

RUN git config --global url."https://github.com/".insteadOf ssh://git@github.com/ && \
    git config --global url."https://github.com/".insteadOf git@github.com/ && \
    git config --global url."https://".insteadOf ssh://

RUN npm install -g @celo/celocli

ENV NO_SYNCCHECK=true

CMD [ "npx", "celo-devchain", "--port=8545" ]