export default [
  {
    context: [
      "/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-corda",
    ],
    target: "http://127.0.0.1:8080",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
  {
    context: [
      "/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu",
    ],
    target: "http://127.0.0.1:4000",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
];

// {
//   "/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-corda": {
//     "target": "http://127.0.0.1:8080",
//     "secure": false,
//     "logLevel": "debug"
//   },
//   "/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu": {
//     "target": "http://127.0.0.1:4000",
//     "secure": false,
//     "logLevel": "debug"
//   }
// }
