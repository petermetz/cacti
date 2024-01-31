window.BENCHMARK_DATA = {
  "lastUpdate": 1706662668773,
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
            "email": "peter.somogyvari@accenture.com",
            "name": "Peter Somogyvari",
            "username": "petermetz"
          },
          "distinct": true,
          "id": "8b0d2e18d0c93362f18aa61f18007628a48e8248",
          "message": "squash! test 5\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-01-30T16:48:15-08:00",
          "tree_id": "b90594ff7a33257f6130890f5dc8372497ab9c3f",
          "url": "https://github.com/petermetz/cacti/commit/8b0d2e18d0c93362f18aa61f18007628a48e8248"
        },
        "date": 1706662667908,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 610,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "177 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 387,
            "range": "±1.63%",
            "unit": "ops/sec",
            "extra": "182 samples"
          }
        ]
      }
    ]
  }
}