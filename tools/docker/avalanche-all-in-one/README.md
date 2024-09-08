# avalanche-all-in-one

## Building the Image Locally


```sh
docker build \
    --progress=plain \
    --file ./tools/docker/avalanche-all-in-one/Dockerfile \
    ./tools/docker/avalanche-all-in-one/ \
    --tag aaio \
    --tag avalanche-all-in-one \
    --tag ghcr.io/hyperledger/cacti-avalanche-all-in-one:$(git describe --contains --all HEAD | tr / _)_$(git rev-parse --short HEAD)_$(date -u +"%Y-%m-%dT%H-%M-%SZ")
```
