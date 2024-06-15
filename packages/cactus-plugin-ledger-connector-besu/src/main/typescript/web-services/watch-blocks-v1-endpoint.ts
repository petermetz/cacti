import type { Socket as SocketIoSocket } from "socket.io";
import Web3 from "web3";

import {
  Logger,
  Checks,
  coerceUnknownToError,
} from "@hyperledger/cactus-common";
import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import { WatchBlocksV1Progress } from "../generated/openapi/typescript-axios";
import { WatchBlocksV1 } from "../generated/openapi/typescript-axios";
import { Web3BlockHeader } from "../generated/openapi/typescript-axios";

export interface IWatchBlocksV1EndpointOptions {
  logLevel?: LogLevelDesc;
  socket: SocketIoSocket;
  web3: Web3;
}

export class WatchBlocksV1Endpoint {
  public static readonly CLASS_NAME = "WatchBlocksV1Endpoint";

  private readonly log: Logger;
  private readonly socket: SocketIoSocket<
    Record<WatchBlocksV1, (next: string) => void>,
    Record<WatchBlocksV1, (next: WatchBlocksV1Progress | Error) => void>
  >;
  private readonly web3: Web3;

  public get className(): string {
    return WatchBlocksV1Endpoint.CLASS_NAME;
  }

  constructor(public readonly options: IWatchBlocksV1EndpointOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.web3, `${fnTag} arg options.web3`);
    Checks.truthy(options.socket, `${fnTag} arg options.socket`);

    this.web3 = options.web3;
    this.socket = options.socket;

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public async subscribe(): Promise<void> {
    const { socket, log, web3 } = this;
    const fn = `${WatchBlocksV1Endpoint.CLASS_NAME}#subscribe()`;
    log.debug(`${WatchBlocksV1.Subscribe} => ${socket.id}`);
    const sub = await web3.eth.subscribe(
      "newBlockHeaders",
      async (ex: unknown, blockHeader: unknown) => {
        log.debug("newBlockHeaders: Error=%o BlockHeader=%o", ex, blockHeader);
        if (blockHeader) {
          const next: WatchBlocksV1Progress = {
            // Cast needed because somewhere between Web3 v1.5.2 and v1.6.1 they
            // made the receiptRoot property of the BlockHeader type optional.
            // This could be accompanied by a breaking change in their code or
            // it could've been just a mistake in their typings that they corrected.
            // Either way, with the next major release, we need to make it optional
            // in our API specs as well so that they match up.
            blockHeader: blockHeader as unknown as Web3BlockHeader,
          };
          socket.emit(WatchBlocksV1.Next, next);
        }
        if (ex) {
          const err = ex instanceof Error ? ex : coerceUnknownToError(ex);
          socket.emit(WatchBlocksV1.Error, err);
        }
        this.log.debug("%s Unsubscribing...", fn);
        await sub.unsubscribe();
        this.log.debug("%s Unsubscribed OK.", fn);
      },
    );

    log.debug("Subscribing to Web3 new block headers event...");

    socket.on("disconnect", async (reason: string) => {
      log.debug("%s WebSocket:disconnect reason=%o", fn, reason);
      await sub.unsubscribe();
      log.debug("%s WebSocket:disconnect Web3 unsubscribe OK", fn);
    });

    socket.on(WatchBlocksV1.Unsubscribe, async () => {
      log.debug(`%s ${WatchBlocksV1.Unsubscribe}: unsubscribing Web3...`, fn);
      await sub.unsubscribe();
      log.debug("%s %s Web3 unsubscribe OK.", fn, WatchBlocksV1.Unsubscribe);
    });
  }
}
