# ChainLink All-In-One Ledger Image

This is a container image which is designed to accurately simulate a ChainLInk node for testing purposes on localhost.

Because of it having been designed for test automation use-cases, we try
to make the image as light as possible.

## Usage

### Build and Run Image Locally

```sh
DOCKER_BUILDKIT=1 docker build \
    --progress=plain \
    --file ./tools/docker/chainlink-all-in-one/Dockerfile \
    ./tools/docker/chainlink-all-in-one/ \
    --tag claio \
    --tag chainlink-all-in-one \
    --tag ghcr.io/hyperledger/cacti-chainlink-all-in-one:$(date +"%Y-%m-%dT%H-%M-%S" --utc)-dev-$(git rev-parse --short HEAD)
```

```sh
docker run --rm -it claio
```


## References

$ cd ~/.chainlink && docker run -p 6688:6688 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink local n