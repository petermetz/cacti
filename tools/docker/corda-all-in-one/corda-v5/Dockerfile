FROM cruizba/ubuntu-dind:20.10.9

WORKDIR /

RUN apt update
RUN apt -y upgrade

# Install git so we can check out the corda5-solarsystem-contracts-demo repo of Corda
RUN apt install -y git

# Need curl to run healthchecks
RUN apt install -y curl

RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends openjdk-11-jdk

RUN curl https://download.corda.net/corda-cli/1.0.0-DevPreview/get-corda-cli.sh > /get-corda-cli.sh
RUN chmod +x /get-corda-cli.sh
RUN /get-corda-cli.sh

RUN curl https://download.corda.net/cordapp-builder/5.0.0-DevPreview-1.0/cordapp-builder-installer.jar --output /cordapp-builder-installer.jar
RUN java -jar /cordapp-builder-installer.jar

RUN git clone https://github.com/corda/corda5-solarsystem-contracts-demo.git
WORKDIR /corda5-solarsystem-contracts-demo
ARG SOLARSYSTEM_DEMO_SHA=a3be5ad48d249be7f71c5f15074c874dc0d09b41
RUN git checkout ${SOLARSYSTEM_DEMO_SHA}

RUN /root/bin/corda-cli/bin/corda-cli network config docker-compose solar-system
RUN chmod +x gradlew
RUN ./gradlew build

RUN /root/bin/corda-cli/bin/corda-cli network deploy -n solar-system -f solar-system.yaml > docker-compose.yaml
RUN find / -iname docker-compose.yaml

# OpenSSH server
EXPOSE 22

# supervisord web ui/dashboard
EXPOSE 9001

# earth-node RPC
EXPOSE 12112

# mars-node RPC
EXPOSE 12116

# pluto-node RPC
EXPOSE 12119

# notary-node RPC
EXPOSE 12122

# FIXME: Add image caching so that it doesn't download the Corda images every time
# we run the container (will result in DockerHub rate limits messing with both
# the CI and the developer experience)
COPY ./supervisor/ /etc/supervisor/conf.d/
ENTRYPOINT [ "/usr/bin/supervisord", "-n" ]

COPY healthcheck.sh /
HEALTHCHECK --interval=2s --timeout=5s --start-period=30s --retries=180 CMD /healthcheck.sh
