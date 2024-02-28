window.BENCHMARK_DATA = {
  "lastUpdate": 1709082081697,
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
      },
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
          "id": "d1e153dec5655bd79e997b7623c5a0168cbe02f0",
          "message": "squash! - test 6 - worsened performance!\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-01-30T17:12:59-08:00",
          "tree_id": "5e2b8d2200bdf42ba6cfba247bd9e812929787b7",
          "url": "https://github.com/petermetz/cacti/commit/d1e153dec5655bd79e997b7623c5a0168cbe02f0"
        },
        "date": 1706664142026,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 9.72,
            "range": "±0.30%",
            "unit": "ops/sec",
            "extra": "145 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 402,
            "range": "±1.39%",
            "unit": "ops/sec",
            "extra": "183 samples"
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
          "id": "0804bab4c9b43f2e22be6d77be127415a9a0532f",
          "message": "perf(cmd-api-server): add demonstration of continuous benchmarking\n\nPrimary change:\n---------------\n\nThis is the ice-breaker for some work that got stuck related to this issue:\nhttps://github.com/hyperledger/cacti/issues/2672\n\nThe used benchamking library (benchmark.js) is old but solid and has\nalmost no dependencies which means that we'll be in the clear longer term\nwhen it comes to CVEs popping up.\n\nThe benchmarks added here are very simple and measure the throughput of\nthe API server's Open API spec providing endpoints.\n\nThe GitHub action that we use is designed to do regression detection and\nreporting but this is hard to verify before actually putting it in place\nas we cannot simulate the CI environment's clone on a local environment.\n\nThe hope is that this change will make it so that if someone tries to\nmake a code change that will lower performance significantly, then we\ncan catch that at the review stage instead of having to find out later.\n\nSecondary change:\n-----------------\n\n1. Started using tsx in favor of ts-node because it appers to be about\n5% faster when looking at the benchmark execution. It also claims to have\nless problems with ESM compared to ts-node so if this initial trial\ngoes well we could later on decide to swap out ts-node with it project-wide.\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-02-02T00:09:44-08:00",
          "tree_id": "741d7ddf0400698b2fdfb3d8ac58c18e884a4afe",
          "url": "https://github.com/petermetz/cacti/commit/0804bab4c9b43f2e22be6d77be127415a9a0532f"
        },
        "date": 1707188622215,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 600,
            "range": "±1.64%",
            "unit": "ops/sec",
            "extra": "177 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 374,
            "range": "±1.74%",
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
          "distinct": false,
          "id": "fb50fb2a43904f6fd6ae7b25b2faf9237d57006f",
          "message": "build(deps): fix CVE-2024-21484 - force jsrsasign >=11.0.0 resolutions\n\n1. Also upgraded the Fabric ledger related dependencies across the board\nbecause this newer version has a higher probability of not having issues\nwith the newer transitive dependency that we are forcing on it.\n\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-02-13T23:58:19-08:00",
          "tree_id": "c390e5b164f43f560715bdd426f2714e444d0d3d",
          "url": "https://github.com/petermetz/cacti/commit/fb50fb2a43904f6fd6ae7b25b2faf9237d57006f"
        },
        "date": 1707925053979,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 584,
            "range": "±1.88%",
            "unit": "ops/sec",
            "extra": "177 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 368,
            "range": "±1.35%",
            "unit": "ops/sec",
            "extra": "180 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "anmolbansal1807@gmail.com",
            "name": "Anmol Bansal",
            "username": "AnmolBansalDEV"
          },
          "committer": {
            "email": "petermetz@users.noreply.github.com",
            "name": "Peter Somogyvari",
            "username": "petermetz"
          },
          "distinct": true,
          "id": "6a476a0f1143380d2fd6bf81c68b0842c13c6ae2",
          "message": "feat(connector-polkadot): add connector pkg, openapi specs, test suite\n\nPrimary Changes\n---------------\n1. Created openapi specs for get-prometheus-exporter-metrics, get-transaction-info,\n   get-raw-transaction, sign-raw-transaction, run-transaction, deploy-contract-ink,\n   and invoke-contract endpoints\n2. Created relevant types for the request as well as response for the above endpoints\n3. Added generated code for these endpoints\n4. Created connector class with functions to interact with the polkadot ledger\n5. Created webservices to interact with the endpoint and the relevant class method\n6. Created unit and integration testcases in jest to test base functionality of the connector\n\nSecondary Changes\n-----------------\n1. Added an ink! contract for running the testcases\n2. Added the polkadot connector to ci workflow\n3. Created substrate.md to docs-cactus\n4. Added the polkadot connector to tsconfig.json\n\nSigned-off-by: Anmol Bansal <anmolbansal1807@gmail.com>\n\n=======================================================================\n\nfeat(polkadot): creation of polkadot AIO image\n\nPrimary Changes\n---------------\n1. Updated docker image to include multi-stage build\n2. Added healthcheck to the image\n3. Added Supervisord and removed unneccessary start script\n4. Updated the Readme with relevant commands\n\nSigned-off-by: Anmol Bansal <anmolbansal1807@gmail.com>\n\n=======================================================================\n\nfeat(polkadot): update substrate test tooling\n\nPrimary Changes\n---------------\n1. Added correct healthcheck for ledger container\n2. Update the Substrate test ledger testcases\n\nSigned-off-by: Anmol Bansal <anmolbansal1807@gmail.com>\n\n=======================================================================\n\nfeat(polkadot): creation of readme and architecture reference diagrams\n\nPrimary Changes\n---------------\n1. Added README.md for the connector\n2. Added Architecture diagrams for the plugin\n\nSecondary Changes\n-----------------\n1. Added the docker image for the polkadot connector\n\nFixes hyperledger/cacti#726\nFixes hyperledger/cacti#727\nFixes hyperledger/cacti#627\n\nCo-authored-by: Peter Somogyvari <peter.somogyvari@accenture.com>\n\nSigned-off-by: Anmol Bansal <anmolbansal1807@gmail.com>\nSigned-off-by: Peter Somogyvari <peter.somogyvari@accenture.com>",
          "timestamp": "2024-02-27T13:31:05-08:00",
          "tree_id": "1e627dac65b9400842418f4e0039467a9c3443eb",
          "url": "https://github.com/petermetz/cacti/commit/6a476a0f1143380d2fd6bf81c68b0842c13c6ae2"
        },
        "date": 1709082080383,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "cmd-api-server_HTTP_GET_getOpenApiSpecV1",
            "value": 619,
            "range": "±1.75%",
            "unit": "ops/sec",
            "extra": "178 samples"
          },
          {
            "name": "cmd-api-server_gRPC_GetOpenApiSpecV1",
            "value": 384,
            "range": "±1.59%",
            "unit": "ops/sec",
            "extra": "181 samples"
          }
        ]
      }
    ]
  }
}