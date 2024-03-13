window.BENCHMARK_DATA = {
  "lastUpdate": 1710351177119,
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
          "distinct": true,
          "id": "dec0f3b2b6d86dd20a705287eea26cabc722b482",
          "message": "ci(github): stop using NodeJS v16 based actions due to deprecation\n\nNo changes other than the mass find & replacing of the GitHub actions\nthat we use for setting up NodeJS, checking code out and caching.\n\nAddress the warnings that started popping up in the CI that look like\nthis, asking for a mass-upgrade of CI action versions:\n\n> Node.js 16 actions are deprecated. Please update the following actions to use Node.js 20:\n> actions/setup-node@v4.0.2,\n> actions/checkout@v4.1.1,\n> actions/cache@v4.0.1\n> For more information see:\n> https://github.blog/changelog/2023-09-22-github-actions-transitioning-from-node-16-to-node-20/.\n\nFixes #3079\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-03-13T02:54:51-07:00",
          "tree_id": "c164783d9e7ffc6ecbb8045e74b256828f45ff5a",
          "url": "https://github.com/petermetz/cacti/commit/dec0f3b2b6d86dd20a705287eea26cabc722b482"
        },
        "date": 1710351174653,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 618,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "176 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 388,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "182 samples"
          }
        ]
      }
    ]
  }
}