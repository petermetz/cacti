import { randomUUID } from "node:crypto";

import { WebSocketServer, WebSocket } from "ws";
import hre from "hardhat";
import safeStringify from "fast-safe-stringify";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";

type Subscription = {
  id: string;
  type: string;
  params: any;
  client: WebSocket;
};

const subscriptions: Map<string, Subscription> = new Map();

export async function startEvmProxy(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly chainId?: Readonly<bigint>;
  readonly passphrase?: Readonly<string>;
  readonly mnemonic?: Readonly<string>;
}): Promise<{ readonly out: unknown }> {
  const log = LoggerProvider.getOrCreate({
    label: "startEvmProxy()",
    level: opts.logLevel || "WARN",
  });
  log.debug("ENTER");

  const { mnemonic = randomUUID(), chainId = 1337n } = opts;
  const isPassphraseAString = typeof opts.passphrase === "string";
  const passphrase = isPassphraseAString ? opts.passphrase : randomUUID();

  hre.config.networks.evmproxy = {
    ...hre.config.networks.hardhat,
    chainId: Number(chainId),
    blockGasLimit: 25_000_000,
    hardfork: "paris",
    loggingEnabled: true,
    allowUnlimitedContractSize: true,
    throwOnCallFailures: true,
    throwOnTransactionFailures: true,
    accounts: {
      accountsBalance: BigInt(10e21).toString(10),
      mnemonic,
      path: "m/44'/60'/0'/0",
      initialIndex: 0,
      count: 20,
      passphrase,
    },
  };

  log.info("Starting Hardhat node...");
  await hre.run("node");

  log.info("Setting up WebSocket server...");
  const wsServer = new WebSocketServer({ port: 8546 });

  wsServer.on("connection", (ws) => {
    handleConnection(ws, opts);
  });

  log.info("WebSocket server is running on ws://localhost:8546");

  const out = { out: { message: "EVM Proxy and WebSocket server started" } };
  return out;
}

function handleConnection(
  ws: WebSocket,
  opts: { readonly logLevel: Readonly<LogLevelDesc> },
) {
  const log = LoggerProvider.getOrCreate({
    label: "handleConnection()",
    level: opts.logLevel || "WARN",
  });

  log.info("New WebSocket connection established");

  ws.on("message", (data) => {
    handleMessage(ws, data, opts);
  });

  ws.on("close", () => {
    log.info("WebSocket connection closed");
    // Clean up subscriptions for the disconnected client
    for (const [id, sub] of subscriptions.entries()) {
      if (sub.client === ws) {
        subscriptions.delete(id);
      }
    }
  });
}

function handleMessage(
  ws: WebSocket,
  data: any,
  opts: { readonly logLevel: Readonly<LogLevelDesc> },
) {
  const log = LoggerProvider.getOrCreate({
    label: "handleMessage()",
    level: opts.logLevel || "WARN",
  });

  log.debug("Received WebSocket message:", data.toString());

  try {
    const request = JSON.parse(data.toString());

    if (request.jsonrpc === "2.0") {
      switch (request.method) {
        case "eth_subscribe":
          handleEthSubscribe(ws, request, opts);
          break;

        case "eth_unsubscribe":
          handleEthUnsubscribe(request, opts);
          break;

        default:
          forwardRequest(ws, request, opts);
      }
    } else {
      ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          id: request.id,
          error: { code: -32600, message: "Invalid Request" },
        }),
      );
    }
  } catch (error) {
    log.error("Error handling WebSocket message:", error);
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32000, message: "Server error" },
      }),
    );
  }
}

function handleEthSubscribe(
  ws: WebSocket,
  request: any,
  opts: { readonly logLevel: Readonly<LogLevelDesc> },
) {
  const log = LoggerProvider.getOrCreate({
    label: "handleEthSubscribe()",
    level: opts.logLevel || "WARN",
  });

  const { params } = request;

  if (params[0] === "newHeads" || params[0] === "logs") {
    const id = randomUUID();
    subscriptions.set(id, {
      id,
      type: params[0],
      params: params[1] || {},
      client: ws,
    });

    ws.send(JSON.stringify({ jsonrpc: "2.0", id: request.id, result: id }));
    log.info(`Subscription added: ${id}`);
  } else {
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: request.id,
        error: { code: -32000, message: "Unsupported subscription type" },
      }),
    );
    log.warn("Unsupported subscription type:", params[0]);
  }
}

function handleEthUnsubscribe(
  request: any,
  opts: { readonly logLevel: Readonly<LogLevelDesc> },
) {
  const log = LoggerProvider.getOrCreate({
    label: "handleEthUnsubscribe()",
    level: opts.logLevel || "WARN",
  });

  const { params, id } = request;
  log.debug("ENTRY id=%s params=%s", id, safeStringify(params));

  if (params && params[0]) {
    subscriptions.delete(params[0]);
    log.info(`Subscription removed: ${params[0]}`);
  } else {
    log.warn("Invalid unsubscribe request:", request);
  }
}

function forwardRequest(
  ws: WebSocket,
  request: any,
  opts: { readonly logLevel: Readonly<LogLevelDesc> },
) {
  const log = LoggerProvider.getOrCreate({
    label: "forwardRequest()",
    level: opts.logLevel || "WARN",
  });

  log.debug(`Forwarding request: ${request.method}`);
  hre.network.provider
    .send(request.method, request.params || [])
    .then((response) => {
      ws.send(
        JSON.stringify({ jsonrpc: "2.0", id: request.id, result: response }),
      );
    })
    .catch((error) => {
      log.error(`Error forwarding request: ${request.method}`, error);
      ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          id: request.id,
          error: { code: -32000, message: "Server error" },
        }),
      );
    });
}
