import type { HttpProvider, IpcProvider, WebsocketProvider } from "web3-core";
import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import Web3 from "web3";
import {
  type IWeb3ProviderOptions,
  Web3ProviderKind,
} from "../plugin-ledger-connector-celo";

export type Web3V1_10_4_Provider =
  | string
  | HttpProvider
  | IpcProvider
  | WebsocketProvider;

export function createWeb3V1_10_4_Provider(req: {
  readonly opts: Readonly<IWeb3ProviderOptions>;
  readonly logLevel: LogLevelDesc;
}): Web3V1_10_4_Provider {
  const fn = `createWeb3Provider()`;
  const log = LoggerProvider.getOrCreate({
    label: "createWeb3Provider()",
    level: req.logLevel,
  });
  log.trace("ENTRY");

  const { opts } = req;
  if (!opts) {
    throw new TypeError(`${fn} req.opts falsy.`);
  }
  const { kind, url } = opts;
  if (!kind) {
    throw new TypeError(`${fn} req.opts.kind falsy.`);
  }
  if (!url) {
    throw new TypeError(`${fn} req.opts.url falsy.`);
  }
  if (typeof url !== "string") {
    throw new TypeError(`${fn} req.opts.url non-string.`);
  }
  if (url.length < 1) {
    throw new TypeError(`${fn} req.opts.url blank.`);
  }

  switch (kind) {
    case Web3ProviderKind.HTTP: {
      const provider = new Web3.providers.HttpProvider(url);
      log.trace("EXIT with HttpProvider");
      return provider;
    }
    case Web3ProviderKind.WEBSOCKET: {
      const provider = new Web3.providers.WebsocketProvider(url);
      log.trace("EXIT with WebsocketProvider");
      return provider;
    }
    default: {
      throw new TypeError(`${fn} unknown Web3ProviderKind: ${kind}`);
    }
  }
}
