import { AddressInfo } from "net";
import { Server } from "http";

import {
  exportPKCS8,
  generateKeyPair,
  KeyLike,
  exportSPKI,
  SignJWT,
} from "jose";
import expressJwt from "express-jwt";

import { v4 as uuidv4 } from "uuid";
import exitHook, { IAsyncExitHookDoneCallback } from "async-exit-hook";

import {
  CactusNode,
  Consortium,
  ConsortiumDatabase,
  ConsortiumMember,
  IPluginKeychain,
  Ledger,
  LedgerType,
} from "@hyperledger/cactus-core-api";

import { PluginRegistry } from "@hyperledger/cactus-core";

import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
  Servers,
  IJoseFittingJwtParams,
} from "@hyperledger/cactus-common";

import {
  ApiServer,
  AuthorizationProtocol,
  ConfigService,
  IAuthorizationConfig,
} from "@hyperledger/cactus-cmd-api-server";

import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";

import {
  PluginLedgerConnectorBesu,
  DefaultApi as BesuApi,
  Web3SigningCredentialType,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";

import { AppDummyInfrastructure } from "./infrastructure/app-dummy-infrastructure";
import { BesuApiClientOptions } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { HarmoniaCactiPlugin } from "@hyperledger/cacti-example-harmonia-plugin";

export interface IAppOptions {
  disableSignalHandlers?: true;
  logLevel?: LogLevelDesc;
  keychain?: IPluginKeychain;
}

export type ShutdownHook = () => Promise<void>;

export class App {
  private readonly log: Logger;
  private readonly shutdownHooks: ShutdownHook[];
  private readonly ledgers: AppDummyInfrastructure;
  public readonly keychain: IPluginKeychain;
  private _besuApiClient?: BesuApi;
  private authorizationConfig?: IAuthorizationConfig;
  private token?: string;

  public get besuApiClientOrThrow(): BesuApi {
    if (this._besuApiClient) {
      return this._besuApiClient;
    } else {
      throw new Error("Invalid state: ledgers were not started yet.");
    }
  }

  public constructor(public readonly options: IAppOptions) {
    const fnTag = "App#constructor()";

    if (!options) {
      throw new Error(`${fnTag} options parameter is falsy`);
    }
    const { logLevel } = options;

    const level = logLevel || "INFO";
    const label = "supply-chain-app";
    this.log = LoggerProvider.getOrCreate({ level, label });

    if (this.options.keychain) {
      this.keychain = this.options.keychain;
      this.log.info("Reusing the provided keychain plugin...");
    } else {
      this.log.info("Instantiating new keychain plugin...");
      this.keychain = new PluginKeychainMemory({
        instanceId: uuidv4(),
        keychainId: uuidv4(),
        logLevel: this.options.logLevel || "INFO",
      });
    }
    this.log.info("KeychainID=%o", this.keychain.getKeychainId());

    this.ledgers = new AppDummyInfrastructure({
      logLevel,
      keychain: this.keychain,
    });
    this.shutdownHooks = [];
  }

  async getOrCreateToken(): Promise<string> {
    if (!this.token) {
      await this.createAuthorizationConfig();
    }
    return this.token as string;
  }

  async getOrCreateAuthorizationConfig(): Promise<IAuthorizationConfig> {
    if (!this.authorizationConfig) {
      await this.createAuthorizationConfig();
    }
    return this.authorizationConfig as IAuthorizationConfig;
  }

  async createAuthorizationConfig(): Promise<void> {
    const jwtKeyPair = await generateKeyPair("RS256", { modulusLength: 4096 });
    const jwtPrivateKeyPem = await exportPKCS8(jwtKeyPair.privateKey);
    const expressJwtOptions: expressJwt.Params & IJoseFittingJwtParams = {
      algorithms: ["RS256"],
      secret: jwtPrivateKeyPem,
      audience: uuidv4(),
      issuer: uuidv4(),
    };

    const jwtPayload = { name: "Peter", location: "London" };
    this.token = await new SignJWT(jwtPayload)
      .setProtectedHeader({
        alg: "RS256",
      })
      .setIssuer(expressJwtOptions.issuer)
      .setAudience(expressJwtOptions.audience)
      .sign(jwtKeyPair.privateKey);

    this.authorizationConfig = {
      unprotectedEndpointExemptions: [],
      expressJwtOptions,
      socketIoJwtOptions: {
        secret: jwtPrivateKeyPem,
      },
    };
  }

  public async start(): Promise<IStartInfo> {
    this.log.debug(`Starting SupplyChainApp...`);

    if (!this.options.disableSignalHandlers) {
      exitHook((callback: IAsyncExitHookDoneCallback) => {
        this.stop().then(callback);
      });
      this.log.debug(`Registered signal handlers for graceful auto-shutdown`);
    }

    await this.ledgers.start();
    this.onShutdown(() => this.ledgers.stop());

    const contractsInfo = await this.ledgers.deployContracts();

    const besuAccount = await this.ledgers.besu.createEthTestAccount();
    await this.keychain.set(besuAccount.address, besuAccount.privateKey);

    // Reserve the ports where the Cactus nodes will run API servers, GUI
    const httpApiA = await Servers.startOnPort(4000, "0.0.0.0");
    const httpGuiA = await Servers.startOnPort(3000, "0.0.0.0");

    const addressInfoA = httpApiA.address() as AddressInfo;
    const nodeApiHostA = `http://localhost:${addressInfoA.port}`;

    const token = await this.getOrCreateToken();
    const baseOptions = { headers: { Authorization: `Bearer ${token}` } };

    const besuConfig = new BesuApiClientOptions({
      basePath: nodeApiHostA,
      baseOptions,
    });

    const besuApiClient = new BesuApi(besuConfig);

    this.log.info(`Configuring Cactus Node for Ledger A...`);
    const rpcApiHostA = await this.ledgers.besu.getRpcApiHttpHost();
    const rpcApiWsHostA = await this.ledgers.besu.getRpcApiWsHost();

    const registryA = new PluginRegistry({
      plugins: [
        new HarmoniaCactiPlugin({
          logLevel: this.options.logLevel,
          contracts: contractsInfo,
          instanceId: uuidv4(),
          besuApiClient,
          web3SigningCredential: {
            keychainEntryKey: besuAccount.address,
            keychainId: this.keychain.getKeychainId(),
            type: Web3SigningCredentialType.CactusKeychainRef,
          },
        }),
        this.keychain,
      ],
    });

    const connectorBesu = new PluginLedgerConnectorBesu({
      instanceId: "PluginLedgerConnectorBesu_A",
      rpcApiHttpHost: rpcApiHostA,
      rpcApiWsHost: rpcApiWsHostA,
      pluginRegistry: registryA,
      logLevel: this.options.logLevel,
    });

    registryA.add(connectorBesu);

    const apiServerA = await this.startNode(httpApiA, httpGuiA, registryA);

    this.log.info(`JWT generated by the application: ${token}`);

    return {
      apiServerA,
      besuApiClient,
      // supplyChainApiClientA: new SupplyChainApi(
      //   new Configuration({ basePath: nodeApiHostA, baseOptions }),
      // ),
      // supplyChainApiClientB: new SupplyChainApi(
      //   new Configuration({ basePath: nodeApiHostA, baseOptions }),
      // ),
      // supplyChainApiClientC: new SupplyChainApi(
      //   new Configuration({ basePath: nodeApiHostA, baseOptions }),
      // ),
    };
  }

  public async stop(): Promise<void> {
    for (const hook of this.shutdownHooks) {
      await hook(); // FIXME add timeout here so that shutdown does not hang
    }
  }

  public onShutdown(hook: ShutdownHook): void {
    this.shutdownHooks.push(hook);
  }

  public async createConsortium(
    serverA: Server,
    serverB: Server,
    serverC: Server,
    keyPairA: KeyLike,
    keyPairB: KeyLike,
    keyPairC: KeyLike,
  ): Promise<ConsortiumDatabase> {
    const consortiumName = "Example Supply Chain Consortium";
    const consortiumId = uuidv4();

    const memberIdA = uuidv4();
    const nodeIdA = uuidv4();
    const addressInfoA = serverA.address() as AddressInfo;
    const nodeApiHostA = `http://localhost:${addressInfoA.port}`;

    const publickKeyPemA = await exportSPKI(keyPairA);
    const cactusNodeA: CactusNode = {
      nodeApiHost: nodeApiHostA,
      memberId: memberIdA,
      publicKeyPem: publickKeyPemA,
      consortiumId,
      id: nodeIdA,
      pluginInstanceIds: [],
      ledgerIds: [],
    };

    const memberA: ConsortiumMember = {
      id: memberIdA,
      nodeIds: [cactusNodeA.id],
      name: "Example Manufacturer Corp",
    };

    const ledger1 = {
      id: "BesuDemoLedger",
      ledgerType: LedgerType.Besu1X,
    };
    cactusNodeA.ledgerIds.push(ledger1.id);

    const memberIdB = uuidv4();
    const nodeIdB = uuidv4();
    const addressInfoB = serverB.address() as AddressInfo;
    const nodeApiHostB = `http://localhost:${addressInfoB.port}`;

    const publickKeyPemB = await exportSPKI(keyPairB);
    const cactusNodeB: CactusNode = {
      nodeApiHost: nodeApiHostB,
      memberId: memberIdB,
      publicKeyPem: publickKeyPemB,
      consortiumId,
      id: nodeIdB,
      pluginInstanceIds: [],
      ledgerIds: [],
    };

    const memberB: ConsortiumMember = {
      id: memberIdB,
      nodeIds: [cactusNodeB.id],
      name: "Example Retailer Corp",
    };

    const ledger2: Ledger = {
      id: "QuorumDemoLedger",
      ledgerType: LedgerType.Quorum2X,
    };

    cactusNodeB.ledgerIds.push(ledger2.id);

    const memberIdC = uuidv4();
    const nodeIdC = uuidv4();
    const addressInfoC = serverC.address() as AddressInfo;
    const nodeApiHostC = `http://localhost:${addressInfoC.port}`;

    const publickKeyPemC = await exportSPKI(keyPairC);
    const cactusNodeC: CactusNode = {
      nodeApiHost: nodeApiHostC,
      memberId: memberIdC,
      publicKeyPem: publickKeyPemC,
      consortiumId,
      id: nodeIdC,
      pluginInstanceIds: [],
      ledgerIds: [],
    };

    const memberC: ConsortiumMember = {
      id: memberIdC,
      nodeIds: [cactusNodeC.id],
      name: "TODO",
    };

    const ledger3: Ledger = {
      id: "FabricDemoLedger",
      ledgerType: LedgerType.Fabric14X,
    };

    cactusNodeC.ledgerIds.push(ledger3.id);

    const consortium: Consortium = {
      id: consortiumId,
      name: consortiumName,
      mainApiHost: nodeApiHostA,
      memberIds: [memberA.id, memberB.id, memberC.id],
    };

    const consortiumDatabase: ConsortiumDatabase = {
      cactusNode: [cactusNodeA, cactusNodeB, cactusNodeC],
      consortium: [consortium],
      consortiumMember: [memberA, memberB, memberC],
      ledger: [ledger1, ledger2, ledger3],
      pluginInstance: [],
    };

    return consortiumDatabase;
  }

  public async startNode(
    httpServerApi: Server,
    httpServerCockpit: Server,
    pluginRegistry: PluginRegistry,
  ): Promise<ApiServer> {
    const addressInfoApi = httpServerApi.address() as AddressInfo;
    const addressInfoCockpit = httpServerCockpit.address() as AddressInfo;

    const configService = new ConfigService();
    const config = await configService.getOrCreate();
    const properties = config.getProperties();

    properties.plugins = [];
    properties.configFile = "";
    properties.apiPort = addressInfoApi.port;
    properties.apiHost = addressInfoApi.address;
    properties.cockpitEnabled = true;
    properties.cockpitHost = addressInfoCockpit.address;
    properties.cockpitPort = addressInfoCockpit.port;
    properties.grpcPort = 0; // TODO - make this configurable as well
    properties.logLevel = this.options.logLevel || "INFO";
    properties.authorizationProtocol = AuthorizationProtocol.JSON_WEB_TOKEN;
    properties.authorizationConfigJson =
      await this.getOrCreateAuthorizationConfig();

    const apiServer = new ApiServer({
      config: properties,
      httpServerApi,
      httpServerCockpit,
      pluginRegistry,
    });

    this.onShutdown(() => apiServer.shutdown());

    await apiServer.start();

    return apiServer;
  }
}

export interface IStartInfo {
  readonly apiServerA: ApiServer;
  readonly besuApiClient: BesuApi;
}