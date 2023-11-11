#!/bin/bash

# Without these we get crashes on JDK 17 an above since the introduction of the
# Java Modules system.
EXTRA_JVM_ARGS="--add-exports java.base/sun.security.provider.certpath=ALL-UNNAMED --add-exports java.base/sun.security.util=ALL-UNNAMED --add-exports java.base/sun.security.rsa=ALL-UNNAMED --add-exports jdk.crypto.ec/sun.security.ec=ALL-UNNAMED --add-exports java.base/sun.security.x509=ALL-UNNAMED --add-opens java.base/java.util=ALL-UNNAMED --add-opens java.base/java.time=ALL-UNNAMED --add-opens java.base/java.io=ALL-UNNAMED"

for i in 1 2 3; do java $EXTRA_JVM_ARGS -jar ${APP}/kotlin-spring/build/libs/cactus-connector-corda-server-2.0.0-rc.1.jar && break || sleep 5; done
