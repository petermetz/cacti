window.BENCHMARK_DATA = {
  "lastUpdate": 1710883315334,
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
      }
    ]
  }
}