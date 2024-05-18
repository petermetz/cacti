window.BENCHMARK_DATA = {
  "lastUpdate": 1716076287508,
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
          "id": "3e4f4a74c737e50f34cf6aa3c9f3ed7ffdba8059",
          "message": "build(plugin-keychain-memory): fix local imports broken due to .js exts\n\nFound the solution and a long discussion about it here:\nhttps://github.com/kulshekhar/ts-jest/issues/1057\n\nTLDR: The Jest resolver needs a little extra information/tweak to the\nconfig so that it can correctly handle the .js imports.\n\nSpecifically this comment provided the solution which I made here:\nhttps://github.com/kulshekhar/ts-jest/issues/1057#issuecomment-1482644543\n\nFixes #3254\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-05-16T06:34:06-07:00",
          "tree_id": "759c6dcf60f26c60a590e84b26e52961e18a5ea0",
          "url": "https://github.com/petermetz/cacti/commit/3e4f4a74c737e50f34cf6aa3c9f3ed7ffdba8059"
        },
        "date": 1715906244304,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 603,
            "range": "±1.70%",
            "unit": "ops/sec",
            "extra": "179 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 370,
            "range": "±1.72%",
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
          "distinct": false,
          "id": "3e4f4a74c737e50f34cf6aa3c9f3ed7ffdba8059",
          "message": "build(plugin-keychain-memory): fix local imports broken due to .js exts\n\nFound the solution and a long discussion about it here:\nhttps://github.com/kulshekhar/ts-jest/issues/1057\n\nTLDR: The Jest resolver needs a little extra information/tweak to the\nconfig so that it can correctly handle the .js imports.\n\nSpecifically this comment provided the solution which I made here:\nhttps://github.com/kulshekhar/ts-jest/issues/1057#issuecomment-1482644543\n\nFixes #3254\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-05-16T06:34:06-07:00",
          "tree_id": "759c6dcf60f26c60a590e84b26e52961e18a5ea0",
          "url": "https://github.com/petermetz/cacti/commit/3e4f4a74c737e50f34cf6aa3c9f3ed7ffdba8059"
        },
        "date": 1715907022296,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "plugin-ledger-connector-besu_HTTP_GET_getOpenApiSpecV1",
            "value": 833,
            "range": "±2.48%",
            "unit": "ops/sec",
            "extra": "180 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "zondervan.v.calvez@accenture.com",
            "name": "zondervancalvez",
            "username": "zondervancalvez"
          },
          "committer": {
            "email": "petermetz@users.noreply.github.com",
            "name": "Peter Somogyvari",
            "username": "petermetz"
          },
          "distinct": true,
          "id": "eacaef3cc52512b74b11cdc1b8c1b09e4d82460e",
          "message": "chore(github): shorten ci.yaml workflow and job names\n\nce - cactus-example\ncp - cactus-plugin\ncpk - cactus-plugin-keychain\ncpl - cactus-plugin-ledger\ncplc - cactus-plugin-ledger-connector\nplc - plugin-ledger-connector\ncpp - cactus-plugin-persistence\nct - cactus-test\nctp - cactus-test-plugin\n\nFixes: hyperledger#2624\n\nSigned-off-by: zondervancalvez <zondervan.v.calvez@accenture.com>",
          "timestamp": "2024-05-18T16:17:18-07:00",
          "tree_id": "36312b30100d2d6e1069e72c17470d211eadc167",
          "url": "https://github.com/petermetz/cacti/commit/eacaef3cc52512b74b11cdc1b8c1b09e4d82460e"
        },
        "date": 1716075466152,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 594,
            "range": "±1.57%",
            "unit": "ops/sec",
            "extra": "177 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 363,
            "range": "±1.58%",
            "unit": "ops/sec",
            "extra": "181 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "zondervan.v.calvez@accenture.com",
            "name": "zondervancalvez",
            "username": "zondervancalvez"
          },
          "committer": {
            "email": "petermetz@users.noreply.github.com",
            "name": "Peter Somogyvari",
            "username": "petermetz"
          },
          "distinct": true,
          "id": "eacaef3cc52512b74b11cdc1b8c1b09e4d82460e",
          "message": "chore(github): shorten ci.yaml workflow and job names\n\nce - cactus-example\ncp - cactus-plugin\ncpk - cactus-plugin-keychain\ncpl - cactus-plugin-ledger\ncplc - cactus-plugin-ledger-connector\nplc - plugin-ledger-connector\ncpp - cactus-plugin-persistence\nct - cactus-test\nctp - cactus-test-plugin\n\nFixes: hyperledger#2624\n\nSigned-off-by: zondervancalvez <zondervan.v.calvez@accenture.com>",
          "timestamp": "2024-05-18T16:17:18-07:00",
          "tree_id": "36312b30100d2d6e1069e72c17470d211eadc167",
          "url": "https://github.com/petermetz/cacti/commit/eacaef3cc52512b74b11cdc1b8c1b09e4d82460e"
        },
        "date": 1716076285240,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "plugin-ledger-connector-besu_HTTP_GET_getOpenApiSpecV1",
            "value": 752,
            "range": "±2.87%",
            "unit": "ops/sec",
            "extra": "180 samples"
          }
        ]
      }
    ]
  }
}