FROM docker:20.10.3-dind

ARG SOLARSYSTEM_DEMO_SHA=a3be5ad48d249be7f71c5f15074c874dc0d09b41

WORKDIR /

RUN apk update

# Install dependencies of Docker Compose
RUN apk add py-pip python3-dev libffi-dev openssl-dev gcc libc-dev make

# Install python/pip - We need this because DinD 18.x has Python 2
# And we cannot upgrade to DinD 19 because of
# https://github.com/docker-library/docker/issues/170
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade "pip>=21" setuptools

# Without this the docker-compose installation crashes, complaining about
# a lack of rust compiler...
ENV CRYPTOGRAPHY_DONT_BUILD_RUST=1

# Install Docker Compose
RUN pip install docker-compose

# Install git so we can check out the kotlin-samples repo of Corda
RUN apk add --no-cache git

# Install bash
RUN apk add --no-cache bash

# Need curl to run healthchecks
RUN apk add --no-cache curl

# The file binary is used to inspect exectubles when debugging container image issues
RUN apk add --no-cache file

RUN apk add --no-cache openjdk11

# Need gradle to execute the corda sample app setup commands
RUN apk add --no-cache gradle=6.7.1-r0

ENV CACTUS_CFG_PATH=/etc/hyperledger/cactus
RUN mkdir -p $CACTUS_CFG_PATH

# OpenSSH - need to have it so we can shell in and install/instantiate contracts and troubleshoot
RUN apk add --no-cache openssh augeas

# Configure the OpenSSH server we just installed
RUN augtool 'set /files/etc/ssh/sshd_config/AuthorizedKeysFile ".ssh/authorized_keys /etc/authorized_keys/%u"'
RUN augtool 'set /files/etc/ssh/sshd_config/PermitRootLogin yes'
RUN augtool 'set /files/etc/ssh/sshd_config/PasswordAuthentication yes'
RUN augtool 'set /files/etc/ssh/sshd_config/PermitEmptyPasswords yes'
RUN augtool 'set /files/etc/ssh/sshd_config/Port 22'
RUN augtool 'set /files/etc/ssh/sshd_config/LogLevel DEBUG2'
RUN augtool 'set /files/etc/ssh/sshd_config/LoginGraceTime 10'
# Create the server's key - without this sshd will refuse to start
RUN ssh-keygen -A

# Generate an RSA keypair on the fly to avoid having to hardcode one in the image
# which technically does not pose a security threat since this is only a development
# image, but we do it like this anyway.
RUN mkdir ~/.ssh
RUN chmod 700 ~/.ssh/
RUN touch ~/.ssh/authorized_keys
RUN ["/bin/bash", "-c", "ssh-keygen -t rsa -N '' -f $CACTUS_CFG_PATH/corda-aio-image <<< y"]
RUN mv $CACTUS_CFG_PATH/corda-aio-image $CACTUS_CFG_PATH/corda-aio-image.key
RUN cp $CACTUS_CFG_PATH/corda-aio-image.pub ~/.ssh/authorized_keys

RUN echo "root:root" | chpasswd

RUN curl https://download.corda.net/corda-cli/1.0.0-DevPreview/get-corda-cli.sh > /get-corda-cli.sh
RUN chmod +x /get-corda-cli.sh
RUN /get-corda-cli.sh

RUN curl https://download.corda.net/cordapp-builder/5.0.0-DevPreview-1.0/cordapp-builder-installer.jar --output /cordapp-builder-installer.jar
RUN java -jar /cordapp-builder-installer.jar

RUN git clone https://github.com/corda/corda5-solarsystem-contracts-demo.git
WORKDIR /corda5-solarsystem-contracts-demo
RUN git checkout ${SOLARSYSTEM_DEMO_SHA}

# Install supervisord because we need to run the docker daemon and also the corda network
# meaning that we have multiple processes to run.
RUN apk add --no-cache supervisor

RUN /root/bin/corda-cli/bin/corda-cli network config docker-compose solar-system
RUN chmod +x gradlew
RUN ./gradlew build

RUN find / -iname cordapp-builder

#RUN cordapp-builder create --cpk contracts/build/libs/corda5-solar-system-contracts-demo-contracts-1.0-SNAPSHOT-cordapp.cpk --cpk workflows/build/libs/corda5-solar-system-contracts-demo-workflows-1.0-SNAPSHOT-cordapp.cpk -o solar-system.cpb

#RUN /root/.local/lib/cordapp-builder/bin/cordapp-builder create --cpk contracts\build\libs\corda5-solar-system-contracts-demo --cpk workflows\build\libs\corda5-solar-system-contracts-demo -o solar-system.cpb
RUN /root/bin/corda-cli/bin/corda-cli network deploy -n solar-system -f solar-system.yaml > docker-compose.yaml
RUN find / -iname docker-compose.yaml

COPY corda-v5/docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

#ARG FILE_NETWORK="/corda5-solarsystem-contracts-demo/docker-compose.yaml"
RUN /docker-entrypoint.sh
#$FILE_NETWORK


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


#RUN docker-entrypoint.sh
#ENTRYPOINT ["docker-entrypoint.sh"]
#CMD ["/bin/bash", "/docker-entrypoint.sh", "/corda5-solarsystem-contracts-demo/docker-compose.yaml"]
#CMD ["/corda5-solarsystem-contracts-demo/docker-compose.yaml", "--nodaemon"]
CMD []

# We consider the container healthy
RUN /root/bin/corda-cli/bin/corda-cli network status -n solar-system
#HEALTHCHECK CMD healthcheck.sh

#RUN ~/bin/corda-cli/bin/corda-cli package install -n solar-system solar-system.cpb
