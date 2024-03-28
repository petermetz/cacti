window.BENCHMARK_DATA = {
  "lastUpdate": 1711655737239,
  "repoUrl": "https://github.com/petermetz/cacti",
  "entries": {
    "Benchmark": [
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
          "distinct": false,
          "id": "154ea7d64c24b09796f83fdcfd2a356c9fc38d7a",
          "message": "build(deps): upgrade @grpc/grpc-js to v1.10.3\n\n1. This is a pre-requisite for a bigger change that is adding gRPC\nendpoint support to the plugins.\n2. We've had gRPC support in the API server for a long time, but the\nplugins are not yet able to register their own gRPC services as of now.\n3. The reason we need the newer version is because some types are not\nexported by the older version that we'll be using to implement the\ngRPC support for plugins.\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-03-19T02:09:01-07:00",
          "tree_id": "71d477df8fff97acd17aa728f927387b51ac17c1",
          "url": "https://github.com/petermetz/cacti/commit/154ea7d64c24b09796f83fdcfd2a356c9fc38d7a"
        },
        "date": 1710883313840,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 641,
            "range": "±1.72%",
            "unit": "ops/sec",
            "extra": "179 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 393,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "180 samples"
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
          "id": "e87e57791024824bb19830c66b9f3d2eaed6d629",
          "message": "feat(core-api): add IPluginGrpcService type & user-defined type guard\n\n1. This will be used by the upcoming functionality of the API server that\nallows all plugins to register their own gRPC services as part of the API\nserver's own gRPC service.\n2. The above mechanism will largely be the same conceptually as the one\nwe have for HTTP and SocketIO endpoints already.\n3. It is optional for plugins to implement gRPC services and therefore\nthe interface is a standalone one instead of being baked into the more\ngeneric IPluginWebService interface for example.\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-03-21T10:12:36-07:00",
          "tree_id": "297b3df27500cbf4b1dbe5b5c5d872665072a06f",
          "url": "https://github.com/petermetz/cacti/commit/e87e57791024824bb19830c66b9f3d2eaed6d629"
        },
        "date": 1711142001858,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 586,
            "range": "±1.65%",
            "unit": "ops/sec",
            "extra": "177 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 367,
            "range": "±1.20%",
            "unit": "ops/sec",
            "extra": "181 samples"
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
          "id": "15e21324cae132c71e8ee6b41255858660c3a0f9",
          "message": "build(deps): bump express from 4.17.1 to 4.19.2\n\nBumps [express](https://github.com/expressjs/express) from 4.17.1 to 4.19.2.\n- [Release notes](https://github.com/expressjs/express/releases)\n- [Changelog](https://github.com/expressjs/express/blob/master/History.md)\n- [Commits](https://github.com/expressjs/express/compare/4.17.1...4.19.2)\n\n---\nupdated-dependencies:\n- dependency-name: express\n  dependency-type: direct:production\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>",
          "timestamp": "2024-03-28T09:36:15-07:00",
          "tree_id": "555a91189f21260ae3b43161b19af40985e68029",
          "url": "https://github.com/petermetz/cacti/commit/15e21324cae132c71e8ee6b41255858660c3a0f9"
        },
        "date": 1711655734840,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 566,
            "range": "±1.62%",
            "unit": "ops/sec",
            "extra": "176 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 351,
            "range": "±1.13%",
            "unit": "ops/sec",
            "extra": "180 samples"
          }
        ]
      }
    ]
  }
}