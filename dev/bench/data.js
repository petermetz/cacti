window.BENCHMARK_DATA = {
  "lastUpdate": 1715436609556,
  "repoUrl": "https://github.com/petermetz/cacti",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "aldousss.alvarez@gmail.com",
            "name": "aldousalvarez",
            "username": "aldousalvarez"
          },
          "committer": {
            "email": "petermetz@users.noreply.github.com",
            "name": "Peter Somogyvari",
            "username": "petermetz"
          },
          "distinct": true,
          "id": "c35658b7f38142ba7f9ffd182a4484874927af28",
          "message": "refactor: rename OpenAPI extension in plugin-ledger-connector-polkadot\n\nPrimary Changes\n----------------\n1. Updated the files in packages/cactus-plugin-ledger-\n   connector-polkadot to use x-hyperledger-cacti\n\nFixes #3198\n\nSigned-off-by: aldousalvarez <aldousss.alvarez@gmail.com>",
          "timestamp": "2024-05-11T06:35:56-07:00",
          "tree_id": "3e7a1012d597576f2aac047463b8cf7f6c450f07",
          "url": "https://github.com/petermetz/cacti/commit/c35658b7f38142ba7f9ffd182a4484874927af28"
        },
        "date": 1715436608021,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "plugin-ledger-connector-besu_HTTP_GET_getOpenApiSpecV1",
            "value": 771,
            "range": "±2.61%",
            "unit": "ops/sec",
            "extra": "180 samples"
          }
        ]
      }
    ]
  }
}