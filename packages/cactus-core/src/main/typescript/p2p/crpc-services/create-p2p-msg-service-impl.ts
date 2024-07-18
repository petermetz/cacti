import { Observable, ReplaySubject, Subject } from "rxjs";
import type { ServiceImpl } from "@connectrpc/connect";

import { Checks, Logger } from "@hyperledger/cactus-common";
import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { ICactusPlugin, P2pMsgService } from "@hyperledger/cactus-core-api";
import { P2pMsgV1 } from "@hyperledger/cactus-core-api";

import { PluginRegistry } from "../../plugin-registry";

export interface ICreateP2pMsgServiceImplOptions {
  readonly logLevel: LogLevelDesc;
  readonly pluginRegistry: Readonly<PluginRegistry>;
}

export interface IP2pMsgServiceImplOptions {
  readonly logLevel: LogLevelDesc;
  readonly inbox: Subject<P2pMsgV1>;
  readonly outbox: Observable<P2pMsgV1>;
}

export class P2pMsgServiceImpl implements ServiceImpl<typeof P2pMsgService> {
  // We cannot avoid this due to how the types of the upstream library are
  // structured/designed hence we just disable the linter on this particular line.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;

  private readonly log: Logger;
  public static readonly CLASS_NAME = "P2pMsgServiceImpl";

  constructor(public readonly opts: IP2pMsgServiceImplOptions) {
    const fn = "SignRawTransactionEndpoint#constructor()";

    Checks.truthy(opts, `${fn} arg opts`);
    Checks.truthy(opts.inbox, `${fn} arg opts.inbox`);
    Checks.truthy(opts.outbox, `${fn} arg opts.outbox`);

    const level = this.opts.logLevel || "WARN";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public get className(): string {
    return P2pMsgServiceImpl.CLASS_NAME;
  }

  async *sendReceive(req: AsyncIterable<P2pMsgV1>) {
    const fn = `${this.className}#sendReceive()`;
    this.log.debug("%s ENTER", fn);
    for await (const inMsg of req) {
      this.log.debug("%s putting msg to inbox: %o", fn, inMsg);
      this.opts.inbox.next(inMsg);
    }
    for await (const outMsg of this.opts.outbox) {
      this.log.debug("%s yielding msg to stream from outbox: %o", fn, outMsg);
      yield outMsg;
      this.log.debug("%s yielded msg to stream from outbox: %o", fn, outMsg);
    }
    this.log.debug("%s EXIT", fn);
  }
}

export async function createP2pMsgServiceImpl(
  opts: Readonly<ICreateP2pMsgServiceImplOptions>,
): Promise<P2pMsgServiceImpl> {
  const fn = `core#createP2pMsgServiceImpl()`;
  const logLevel = opts.logLevel || "WARN";
  const log = LoggerProvider.getOrCreate({ level: logLevel, label: fn });

  if (!(opts.pluginRegistry instanceof PluginRegistry)) {
    throw new TypeError(`${fn} expected pluginRegistry as PluginRegistry`);
  }

  const inbox = new ReplaySubject<P2pMsgV1>(1);
  const outbox = new ReplaySubject<P2pMsgV1>(1);

  const svcOpts: IP2pMsgServiceImplOptions = {
    inbox,
    outbox,
    logLevel,
  };

  inbox.subscribe((msg) => {
    log.debug("svc inbox msg received, forwarding to plugins: %o", msg);
    consumers
      // don't deliver messages right back to the sender (avoid infinite loops)
      .filter((p) => p.getInstanceId() !== msg.sender)
      .forEach((p) =>
        p.getInBox().then((inboxOption) => {
          const id = p.getInstanceId();
          const inbox = inboxOption.expect(`Plugin ${id} did not have inbox`);
          log.debug("delivery to inbox of %s: %o", id, msg);
          inbox.next(msg);
        }),
      );
  });

  const consumers: Array<ICactusPlugin> = [];

  const p2pMsgSvcImpl = new P2pMsgServiceImpl(svcOpts);

  log.debug("Creating plugin messaging subscrpitions...");

  const plugins = opts.pluginRegistry.getPlugins();

  const tasksDone = plugins.map(async (plugin: ICactusPlugin) => {
    const outboxOrNone = await plugin.getOutBox();
    if (outboxOrNone.some) {
      outboxOrNone.val.subscribe((msg: P2pMsgV1) => {
        log.debug("outboxOrNone.val.subscribe() ", msg);
        inbox.next(msg);
      });
      log.debug("found %s outbox", plugin.getPackageName());
    } else {
      log.debug("skipping %s outbox", plugin.getPackageName());
    }

    const inboxOrNone = await plugin.getInBox();
    if (inboxOrNone.some) {
      consumers.push(plugin);
      log.debug("found %s inbox", plugin.getPackageName());
    } else {
      log.debug("skipping %s outbox", plugin.getPackageName());
    }

    log.info("processed msg subs for: %s", plugin.getPackageName());
  });

  await Promise.all(tasksDone);

  return p2pMsgSvcImpl;
}
