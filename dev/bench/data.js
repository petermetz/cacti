window.BENCHMARK_DATA = {
  "lastUpdate": 1713073790932,
  "repoUrl": "https://github.com/petermetz/cacti",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "michal.bajer@fujitsu.com",
            "name": "Michal Bajer",
            "username": "outSH"
          },
          "committer": {
            "email": "petermetz@users.noreply.github.com",
            "name": "Peter Somogyvari",
            "username": "petermetz"
          },
          "distinct": true,
          "id": "fa27fde9a28f83ff29964693be656dc107046517",
          "message": "feat(cactus-plugin-ledger-connector-iroha): remove deprecated iroha connector\n\n- Iroha connector is broken for some time and it's SDK does't seem to be\n    actively supported anymore (in regards of bug or security fixes).\n\nCloses: #3159\nPart of: #3155\n\nSigned-off-by: Michal Bajer <michal.bajer@fujitsu.com>",
          "timestamp": "2024-04-01T15:13:07-07:00",
          "tree_id": "179f468f39a57de520043dac3f6866ce0b0e1dd2",
          "url": "https://github.com/petermetz/cacti/commit/fa27fde9a28f83ff29964693be656dc107046517"
        },
        "date": 1712031123657,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 609,
            "range": "±1.74%",
            "unit": "ops/sec",
            "extra": "178 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 375,
            "range": "±1.44%",
            "unit": "ops/sec",
            "extra": "182 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "peter.somogyvari@accenture.com",
            "name": "Peter Somogyvari",
            "username": "petermetz"
          },
          "committer": {
            "email": "petermetz@users.noreply.github.com",
            "name": "Peter Somogyvari",
            "username": "petermetz"
          },
          "distinct": true,
          "id": "9e830874dfed51a805566a5bedc62e3d43fc234f",
          "message": "feat(cactus-core): add ConnectRPC service interface and type guard\n\nDefine the types and type guard needed for the API server to be able to\nrecognize plugins that have implemented a ConnectRPC interface for their\noperations.\n\nAlso, these types will be used by the plugins themselves to mark the\nimplementations as valid for ConnectRPC usage.\n\nConnectRPC is very similar to gRPC but has some nice features in addition\nto it such as the HTTP 2 and HTTP 1.1 proxying through express and\nfastify HTTP server instances.\n\nFor further details see this link:\nhttps://connectrpc.com/\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-04-04T09:06:22-07:00",
          "tree_id": "3cb65cdd21f9da7a8dc739b72c413c9b28fa97c8",
          "url": "https://github.com/petermetz/cacti/commit/9e830874dfed51a805566a5bedc62e3d43fc234f"
        },
        "date": 1712248368937,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 586,
            "range": "±1.69%",
            "unit": "ops/sec",
            "extra": "178 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 363,
            "range": "±1.20%",
            "unit": "ops/sec",
            "extra": "181 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "peter.somogyvari@accenture.com",
            "name": "Peter Somogyvari",
            "username": "petermetz"
          },
          "committer": {
            "email": "petermetz@users.noreply.github.com",
            "name": "Peter Somogyvari",
            "username": "petermetz"
          },
          "distinct": true,
          "id": "383f8528d88989b44c9763fc883c3d9ac74da21e",
          "message": "feat(core): add configureExpressAppBase() utility function\n\n1. The idea here is to re-use the common basic tasks of configuring an\nexpress instance similar to how the API server does it but without having\nthe chicken-egg problem of circular dependencies between the API server\nand the plugins.\n2. More detailed discussion can be seen in this other pull request in\nthe comments: https://github.com/hyperledger/cacti/pull/3169\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-04-08T22:11:33-07:00",
          "tree_id": "7d7999e1129c7c36443db1c4f6dbd7f408183ca3",
          "url": "https://github.com/petermetz/cacti/commit/383f8528d88989b44c9763fc883c3d9ac74da21e"
        },
        "date": 1712647478166,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 581,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "176 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 364,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "182 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "petermetz@users.noreply.github.com",
            "name": "Peter Somogyvari",
            "username": "petermetz"
          },
          "distinct": true,
          "id": "68a46c2be48760e576b0c44cba13dcb731b8e828",
          "message": "build(deps): bump h2\n\nBumps [h2](https://github.com/hyperium/h2) from 0.3.24 to 0.3.26.\n- [Release notes](https://github.com/hyperium/h2/releases)\n- [Changelog](https://github.com/hyperium/h2/blob/v0.3.26/CHANGELOG.md)\n- [Commits](https://github.com/hyperium/h2/compare/v0.3.24...v0.3.26)\n\n---\nupdated-dependencies:\n- dependency-name: h2\n  dependency-type: indirect\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>",
          "timestamp": "2024-04-12T00:16:19-07:00",
          "tree_id": "7fc713a2170cd7b26ef42fcb241a3cb64907dd03",
          "url": "https://github.com/petermetz/cacti/commit/68a46c2be48760e576b0c44cba13dcb731b8e828"
        },
        "date": 1713073788364,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 601,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "179 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 370,
            "range": "±1.32%",
            "unit": "ops/sec",
            "extra": "182 samples"
          }
        ]
      }
    ]
  }
}