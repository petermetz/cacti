import { randomUUID } from "node:crypto";
import { Express } from "express";
import { Option, Some } from "ts-results";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { StringValue } from "google-protobuf/google/protobuf/wrappers_pb";

import {
  ConsensusAlgorithmFamily,
  IPluginLedgerConnector,
  IWebServiceEndpoint,
  IPluginWebService,
  ICactusPlugin,
  ICactusPluginOptions,
  P2pMsgV1,
} from "@hyperledger/cactus-core-api";

import {
  PluginRegistry,
  consensusHasTransactionFinality,
} from "@hyperledger/cactus-core";

import {
  Checks,
  Logger,
  LoggerProvider,
  LogLevelDesc,
} from "@hyperledger/cactus-common";

import { DeployContractEndpoint } from "./web-services/deploy-contract-endpoint";
import { RunTransactionEndpoint } from "./web-services/run-transaction-endpoint";
import { UnprotectedActionEndpoint } from "./web-services/unprotected-action-endpoint";

export interface IPluginLedgerConnectorStubOptions
  extends ICactusPluginOptions {
  pluginRegistry: PluginRegistry;
  logLevel?: LogLevelDesc;
}

export class PluginLedgerConnectorStub
  implements
    IPluginLedgerConnector<unknown, unknown, unknown, unknown>,
    ICactusPlugin,
    IPluginWebService
{
  private readonly instanceId: string;
  private readonly log: Logger;
  private readonly inbox: Subject<P2pMsgV1>;
  private readonly outbox: Subject<P2pMsgV1>;
  private endpoints: IWebServiceEndpoint[] | undefined;

  public static readonly CLASS_NAME = "PluginLedgerConnectorStub";

  public get className(): string {
    return PluginLedgerConnectorStub.CLASS_NAME;
  }

  constructor(public readonly options: IPluginLedgerConnectorStubOptions) {
    const fn = `${this.className}#constructor()`;
    Checks.truthy(options, `${fn} arg options`);
    Checks.truthy(options.instanceId, `${fn} options.instanceId`);
    Checks.truthy(options.pluginRegistry, `${fn} options.pluginRegistry`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });

    this.inbox = new ReplaySubject(1);
    this.outbox = new ReplaySubject(1);

    this.inbox.subscribe((msg: P2pMsgV1) => {
      this.log.debug("inbox p2p msg received: %o", msg);
      const data = new StringValue();
      data.setValue("Hello! The time is: " + new Date().toISOString());
      const replyMsg = new P2pMsgV1({
        id: randomUUID(),
        msgType: "server-1",
        data: data as any,
        sender: this.getInstanceId(),
        createdAt: new Date().toISOString(),
      });
      this.outbox.next(replyMsg);
    });

    this.instanceId = options.instanceId;
    this.log.debug(`Instantiated ${this.className} OK`);
  }

  public getOpenApiSpec(): unknown {
    return null;
  }

  public getInstanceId(): string {
    return this.instanceId;
  }

  public async onPluginInit(): Promise<unknown> {
    return;
  }

  public async getOutBox(): Promise<Option<Observable<P2pMsgV1>>> {
    return Some(this.outbox);
  }

  public async getInBox(): Promise<Option<Subject<P2pMsgV1>>> {
    return Some(this.inbox);
  }

  public async shutdown(): Promise<void> {
    return;
  }

  async registerWebServices(app: Express): Promise<IWebServiceEndpoint[]> {
    const webServices = await this.getOrCreateWebServices();
    await Promise.all(webServices.map((ws) => ws.registerExpress(app)));
    return webServices;
  }

  public async getOrCreateWebServices(): Promise<IWebServiceEndpoint[]> {
    if (Array.isArray(this.endpoints)) {
      return this.endpoints;
    }

    const endpoints: IWebServiceEndpoint[] = [];
    {
      const endpoint = new DeployContractEndpoint({
        connector: this,
        logLevel: this.options.logLevel,
      });
      endpoints.push(endpoint);
    }
    {
      const endpoint = new RunTransactionEndpoint({
        connector: this,
        logLevel: this.options.logLevel,
      });
      endpoints.push(endpoint);
    }
    {
      const endpoint = new UnprotectedActionEndpoint({
        connector: this,
        logLevel: this.options.logLevel,
      });
      endpoints.push(endpoint);
    }
    this.endpoints = endpoints;
    return endpoints;
  }

  public getPackageName(): string {
    // Note: this package does not exist on npm since this plugin only
    // exists for testing purposes
    return `@hyperledger/cactus-plugin-ledger-connector-stub`;
  }

  public async getConsensusAlgorithmFamily(): Promise<ConsensusAlgorithmFamily> {
    return ConsensusAlgorithmFamily.Authority;
  }

  public async hasTransactionFinality(): Promise<boolean> {
    const currentConsensusAlgorithmFamily =
      await this.getConsensusAlgorithmFamily();

    return consensusHasTransactionFinality(currentConsensusAlgorithmFamily);
  }

  public async transact(req: unknown): Promise<unknown> {
    const fnTag = `${this.className}#transact()`;
    Checks.truthy(req, `${fnTag} req`);
    const data = new StringValue();
    data.setValue("Hello! The time is: " + new Date().toISOString());
    const newMsg = new P2pMsgV1({
      id: randomUUID(),
      msgType: this.className,
      data: data as any,
      sender: this.getInstanceId(),
      createdAt: new Date().toISOString(),
    });
    this.outbox.next(newMsg);
    return req;
  }

  public async deployContract(req: unknown): Promise<unknown> {
    const fnTag = `${this.className}#deployContract()`;
    Checks.truthy(req, `${fnTag} req`);
    return req;
  }
}
