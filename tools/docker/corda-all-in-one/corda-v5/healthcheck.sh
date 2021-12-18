#!/bin/bash

set -e

curl -u martian:password --insecure https://localhost:12116/api/v1/nodestatus/getnetworkreadinessstatus
curl -u earthling:password --insecure https://localhost:12112/api/v1/nodestatus/getnetworkreadinessstatus
curl -u plutonian:password --insecure https://localhost:12119/api/v1/nodestatus/getnetworkreadinessstatus

# The notary node does not seem to have the RPC interface opened up or I'm doing something wrong. 
# Need to investigate this in the future so that we can be sure.
# curl -u user1:test --insecure https://localhost:12122/api/v1/nodestatus/getnetworkreadinessstatus
