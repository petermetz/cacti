"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginLedgerConnectorBesu = exports.E_KEYCHAIN_NOT_FOUND = void 0;
const run_time_error_cjs_1 = require("run-time-error-cjs");
const rxjs_1 = require("rxjs");
const typescript_optional_1 = require("typescript-optional");
const viem_1 = require("viem");
const web3_1 = __importDefault(require("web3"));
const web3js_quorum_1 = __importDefault(require("web3js-quorum"));
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
const cactus_core_1 = require("@hyperledger/cactus-core");
const cactus_common_1 = require("@hyperledger/cactus-common");
const deploy_contract_solidity_bytecode_endpoint_1 = require("./web-services/deploy-contract-solidity-bytecode-endpoint");
const deploy_contract_solidity_bytecode_no_keychain_endpoint_1 = require("./web-services/deploy-contract-solidity-bytecode-no-keychain-endpoint");
const index_1 = require("./generated/openapi/typescript-axios/index");
const typescript_axios_1 = require("./generated/openapi/typescript-axios");
const invoke_contract_endpoint_1 = require("./web-services/invoke-contract-endpoint");
const model_type_guards_1 = require("./model-type-guards");
const sign_transaction_endpoint_v1_1 = require("./web-services/sign-transaction-endpoint-v1");
const prometheus_exporter_1 = require("./prometheus-exporter/prometheus-exporter");
const get_prometheus_exporter_metrics_endpoint_v1_1 = require("./web-services/get-prometheus-exporter-metrics-endpoint-v1");
const watch_blocks_v1_endpoint_1 = require("./web-services/watch-blocks-v1-endpoint");
const get_balance_endpoint_1 = require("./web-services/get-balance-endpoint");
const get_transaction_endpoint_1 = require("./web-services/get-transaction-endpoint");
const get_past_logs_endpoint_1 = require("./web-services/get-past-logs-endpoint");
const run_transaction_endpoint_1 = require("./web-services/run-transaction-endpoint");
const get_block_v1_endpoint_1 = require("./web-services/get-block-v1-endpoint-");
const get_besu_record_endpoint_v1_1 = require("./web-services/get-besu-record-endpoint-v1");
const get_open_api_spec_v1_endpoint_1 = require("./web-services/get-open-api-spec-v1-endpoint");
const grpc_default_service = __importStar(require("./generated/proto/protoc-gen-ts/services/default_service"));
const besu_grpc_svc_streams = __importStar(require("./generated/proto/protoc-gen-ts/services/besu-grpc-svc-streams"));
const besu_grpc_svc_open_api_1 = require("./grpc-services/besu-grpc-svc-open-api");
const besu_grpc_svc_streams_1 = require("./grpc-services/besu-grpc-svc-streams");
const get_block_v1_http_1 = require("./impl/get-block-v1/get-block-v1-http");
const transact_v1_impl_1 = require("./impl/transact-v1/transact-v1-impl");
const deploy_contract_v1_keychain_1 = require("./impl/deploy-contract-v1/deploy-contract-v1-keychain");
const deploy_contract_v1_no_keychain_1 = require("./impl/deploy-contract-v1/deploy-contract-v1-no-keychain");
const watch_events_v1_endpoint_1 = require("./web-services/watch-events-v1-endpoint");
const openapi_json_1 = __importDefault(require("../json/openapi.json"));
exports.E_KEYCHAIN_NOT_FOUND = "cactus.connector.besu.keychain_not_found";
class PluginLedgerConnectorBesu {
    options;
    instanceId;
    prometheusExporter;
    log;
    logLevel;
    web3ws;
    web3Http;
    web3;
    viemClient;
    viemWs;
    viemHttp;
    viemHttpTransportConfig;
    viemWebSocketTransportConfig;
    web3Quorum;
    pluginRegistry;
    contracts = {};
    endpoints;
    txSubject = new rxjs_1.ReplaySubject();
    static CLASS_NAME = "PluginLedgerConnectorBesu";
    get className() {
        return PluginLedgerConnectorBesu.CLASS_NAME;
    }
    constructor(options) {
        this.options = options;
        const fnTag = `${this.className}#constructor()`;
        cactus_common_1.Checks.truthy(options, `${fnTag} arg options`);
        cactus_common_1.Checks.truthy(options.rpcApiHttpHost, `${fnTag} options.rpcApiHttpHost`);
        cactus_common_1.Checks.truthy(options.rpcApiWsHost, `${fnTag} options.rpcApiWsHost`);
        cactus_common_1.Checks.truthy(options.pluginRegistry, `${fnTag} options.pluginRegistry`);
        cactus_common_1.Checks.truthy(options.instanceId, `${fnTag} options.instanceId`);
        const { viemWebSocketTransportConfig, viemHttpTransportConfig } = options;
        const { rpcApiHttpHost, rpcApiWsHost, mainTransport = "ws" } = options;
        this.logLevel = this.options.logLevel || "INFO";
        const label = this.className;
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ level: this.logLevel, label });
        this.log.debug("Primary EVM transport (ws|http): %s", mainTransport);
        this.log.debug("Creating Web3 ws for %s", rpcApiWsHost);
        this.web3ws = new web3_1.default.providers.WebsocketProvider(rpcApiWsHost);
        this.log.debug("Creating Web3 http for %s", rpcApiHttpHost);
        this.web3Http = new web3_1.default.providers.HttpProvider(rpcApiHttpHost);
        if (typeof viemWebSocketTransportConfig === "object") {
            this.viemWebSocketTransportConfig = viemWebSocketTransportConfig;
        }
        else {
            this.viemWebSocketTransportConfig = {};
        }
        if (typeof viemHttpTransportConfig === "object") {
            this.viemHttpTransportConfig = viemHttpTransportConfig;
        }
        else {
            this.viemHttpTransportConfig = {};
        }
        const besuChain = (0, viem_1.defineChain)({
            id: options.networkId || 1337,
            name: "Besu",
            network: "besu-network",
            nativeCurrency: {
                decimals: 18,
                name: "Ether",
                symbol: "ETH",
            },
            rpcUrls: {
                default: {
                    http: [this.options.rpcApiHttpHost],
                    websocket: [this.options.rpcApiWsHost],
                },
            },
        });
        this.viemWs = (0, viem_1.webSocket)(rpcApiWsHost, this.viemWebSocketTransportConfig);
        this.log.debug("Instantiated Viem WS transport: %s", rpcApiWsHost);
        this.viemHttp = (0, viem_1.http)(rpcApiHttpHost, this.viemHttpTransportConfig);
        this.log.debug("Instantiated Viem HTTP transport: %s", rpcApiHttpHost);
        const viemTp = mainTransport === "ws" ? this.viemWs : this.viemHttp;
        this.viemClient = (0, viem_1.createPublicClient)({
            chain: besuChain,
            transport: viemTp,
        });
        const web3Tp = mainTransport === "ws" ? this.web3ws : this.web3Http;
        this.web3 = new web3_1.default(web3Tp);
        this.instanceId = options.instanceId;
        this.pluginRegistry = options.pluginRegistry;
        this.prometheusExporter =
            options.prometheusExporter ||
                new prometheus_exporter_1.PrometheusExporter({ pollingIntervalInMin: 1 });
        cactus_common_1.Checks.truthy(this.prometheusExporter, `${fnTag} options.prometheusExporter`);
        this.prometheusExporter.startMetricsCollection();
    }
    getOpenApiSpec() {
        return openapi_json_1.default;
    }
    getPrometheusExporter() {
        return this.prometheusExporter;
    }
    async getPrometheusExporterMetrics() {
        const res = await this.prometheusExporter.getPrometheusMetrics();
        this.log.debug(`getPrometheusExporterMetrics() response: %o`, res);
        return res;
    }
    getInstanceId() {
        return this.instanceId;
    }
    getTxSubjectObservable() {
        return this.txSubject.asObservable();
    }
    async onPluginInit() {
        this.web3Quorum = (0, web3js_quorum_1.default)(this.web3);
        this.log.info("onPluginInit() querying networkId...");
        const networkId = await this.web3.eth.net.getId();
        this.log.info("onPluginInit() obtained networkId: %d", networkId);
    }
    async shutdown() {
        this.log.info(`Shutting down...`);
        if (typeof this.viemClient.transport.getRpcClient === "function") {
            const rpcClient = await this.viemClient.transport.getRpcClient();
            this.log.debug("RPC client obtained.");
            rpcClient.close();
            this.log.debug("RPC client closed.");
        }
        else {
            this.log.debug("viemClient.transport.getRpcClient not a function.");
        }
        this.log.info(`shutdown complete.`);
    }
    async registerWebServices(app, wsApi) {
        const { web3, viemClient } = this;
        const { logLevel } = this.options;
        const webServices = await this.getOrCreateWebServices();
        await Promise.all(webServices.map((ws) => ws.registerExpress(app)));
        wsApi.on("connection", (socket) => {
            this.log.debug(`New Socket connected. ID=${socket.id}`);
            socket.on(typescript_axios_1.WatchBlocksV1.Subscribe, () => {
                new watch_blocks_v1_endpoint_1.WatchBlocksV1Endpoint({ web3, socket, logLevel }).subscribe();
            });
            socket.on(index_1.WatchEventsV1.Subscribe, (req) => {
                new watch_events_v1_endpoint_1.WatchEventsV1Endpoint({ viemClient, socket, logLevel }).subscribe(req);
            });
        });
        return webServices;
    }
    async createGrpcSvcDefAndImplPairs() {
        const openApiSvc = await this.createGrpcOpenApiSvcDefAndImplPair();
        const streamsSvc = await this.createGrpcStreamsSvcDefAndImplPair();
        return [openApiSvc, streamsSvc];
    }
    async createGrpcStreamsSvcDefAndImplPair() {
        const definition = besu_grpc_svc_streams.org.hyperledger.cacti.plugin.ledger.connector.besu
            .services.besuservice.UnimplementedBesuGrpcSvcStreamsService.definition;
        const implementation = new besu_grpc_svc_streams_1.BesuGrpcSvcStreams({
            logLevel: this.logLevel,
            web3: this.web3,
        });
        return { definition, implementation };
    }
    /**
     * Create a new instance of the service implementation.
     * Note: This does not cache the returned objects internally. A new instance
     * is created during every invocation.
     *
     * @returns The gRPC service definition+implementation pair that is backed
     * by the code generated by the OpenAPI generator from the openapi.json spec
     * of this package. Used by the API server to obtain the service objects dynamically
     * at runtime so that the plugin's gRPC services can be exposed in a similar
     * fashion how the HTTP REST endpoints are registered as well.
     */
    async createGrpcOpenApiSvcDefAndImplPair() {
        const definition = grpc_default_service.org.hyperledger.cacti.plugin.ledger.connector.besu
            .services.defaultservice.DefaultServiceClient.service;
        const implementation = new besu_grpc_svc_open_api_1.BesuGrpcSvcOpenApi({
            logLevel: this.logLevel,
            web3: this.web3,
        });
        return { definition, implementation };
    }
    async getOrCreateWebServices() {
        if (Array.isArray(this.endpoints)) {
            return this.endpoints;
        }
        const endpoints = [];
        {
            const endpoint = new deploy_contract_solidity_bytecode_endpoint_1.DeployContractSolidityBytecodeEndpoint({
                connector: this,
                logLevel: this.options.logLevel,
            });
            endpoints.push(endpoint);
        }
        {
            const endpoint = new deploy_contract_solidity_bytecode_no_keychain_endpoint_1.DeployContractSolidityBytecodeNoKeychainEndpoint({
                connector: this,
                logLevel: this.options.logLevel,
            });
            endpoints.push(endpoint);
        }
        {
            const endpoint = new get_balance_endpoint_1.GetBalanceEndpoint({
                connector: this,
                logLevel: this.options.logLevel,
            });
            endpoints.push(endpoint);
        }
        {
            const endpoint = new get_transaction_endpoint_1.GetTransactionEndpoint({
                connector: this,
                logLevel: this.options.logLevel,
            });
            endpoints.push(endpoint);
        }
        {
            const endpoint = new get_past_logs_endpoint_1.GetPastLogsEndpoint({
                connector: this,
                logLevel: this.options.logLevel,
            });
            endpoints.push(endpoint);
        }
        {
            const endpoint = new run_transaction_endpoint_1.RunTransactionEndpoint({
                connector: this,
                logLevel: this.options.logLevel,
            });
            endpoints.push(endpoint);
        }
        {
            const endpoint = new get_block_v1_endpoint_1.GetBlockEndpoint({
                connector: this,
                logLevel: this.options.logLevel,
            });
            endpoints.push(endpoint);
        }
        {
            const endpoint = new invoke_contract_endpoint_1.InvokeContractEndpoint({
                connector: this,
                logLevel: this.options.logLevel,
            });
            endpoints.push(endpoint);
        }
        {
            const endpoint = new sign_transaction_endpoint_v1_1.BesuSignTransactionEndpointV1({
                connector: this,
                logLevel: this.options.logLevel,
            });
            endpoints.push(endpoint);
        }
        {
            const endpoint = new get_besu_record_endpoint_v1_1.GetBesuRecordEndpointV1({
                connector: this,
                logLevel: this.options.logLevel,
            });
            endpoints.push(endpoint);
        }
        {
            const opts = {
                connector: this,
                logLevel: this.options.logLevel,
            };
            const endpoint = new get_prometheus_exporter_metrics_endpoint_v1_1.GetPrometheusExporterMetricsEndpointV1(opts);
            endpoints.push(endpoint);
        }
        {
            const oasPath = openapi_json_1.default.paths["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/get-open-api-spec"];
            const operationId = oasPath.get.operationId;
            const opts = {
                oas: openapi_json_1.default,
                oasPath,
                operationId,
                path: oasPath.get["x-hyperledger-cacti"].http.path,
                pluginRegistry: this.pluginRegistry,
                verbLowerCase: oasPath.get["x-hyperledger-cacti"].http.verbLowerCase,
                logLevel: this.options.logLevel,
            };
            const endpoint = new get_open_api_spec_v1_endpoint_1.GetOpenApiSpecV1Endpoint(opts);
            endpoints.push(endpoint);
        }
        this.endpoints = endpoints;
        return endpoints;
    }
    getPackageName() {
        return `@hyperledger/cactus-plugin-ledger-connector-besu`;
    }
    async getConsensusAlgorithmFamily() {
        return cactus_core_api_1.ConsensusAlgorithmFamily.Authority;
    }
    async hasTransactionFinality() {
        const currentConsensusAlgorithmFamily = await this.getConsensusAlgorithmFamily();
        return (0, cactus_core_1.consensusHasTransactionFinality)(currentConsensusAlgorithmFamily);
    }
    /**
     * Verifies that it is safe to call a specific method of a Web3 Contract.
     *
     * @param contract The Web3 Contract instance to check whether it has a method with a specific name or not.
     * @param name The name of the method that will be checked if it's usable on `contract` or not.
     * @returns Boolean `true` when it IS safe to call the method named `name` on the contract.
     * @throws If the contract instance is falsy or it's methods object is falsy. Also throws if the method name is a blank string.
     */
    async isSafeToCallContractMethod(contract, name) {
        cactus_common_1.Checks.truthy(contract, `${this.className}#isSafeToCallContractMethod():contract`);
        cactus_common_1.Checks.truthy(contract.methods, `${this.className}#isSafeToCallContractMethod():contract.methods`);
        cactus_common_1.Checks.nonBlankString(name, `${this.className}#isSafeToCallContractMethod():name`);
        const { methods } = contract;
        return Object.prototype.hasOwnProperty.call(methods, name);
    }
    async invokeContract(req) {
        const fnTag = `${this.className}#invokeContract()`;
        const contractName = req.contractName;
        let contractInstance;
        if (req.keychainId != undefined) {
            const networkId = await this.web3.eth.net.getId();
            const keychainPlugin = this.pluginRegistry.findOneByKeychainId(req.keychainId);
            cactus_common_1.Checks.truthy(keychainPlugin, `${fnTag} keychain for ID:"${req.keychainId}"`);
            if (!keychainPlugin.has(contractName)) {
                throw new Error(`${fnTag} Cannot create an instance of the contract because the contractName and the contractName of the JSON doesn't match`);
            }
            const contractStr = await keychainPlugin.get(contractName);
            const contractJSON = JSON.parse(contractStr);
            if (contractJSON.networks === undefined ||
                contractJSON.networks[networkId] === undefined ||
                contractJSON.networks[networkId].address === undefined) {
                if ((0, model_type_guards_1.isWeb3SigningCredentialNone)(req.signingCredential)) {
                    throw new Error(`${fnTag} Cannot deploy contract with pre-signed TX`);
                }
                const web3SigningCredential = req.signingCredential;
                const receipt = await this.transact({
                    transactionConfig: {
                        data: `0x${contractJSON.bytecode}`,
                        from: web3SigningCredential.ethAccount,
                        gas: req.gas,
                        gasPrice: req.gasPrice,
                    },
                    consistencyStrategy: {
                        blockConfirmations: 0,
                        receiptType: typescript_axios_1.ReceiptType.NodeTxPoolAck,
                        timeoutMs: req.timeoutMs || 60000,
                    },
                    web3SigningCredential,
                    privateTransactionConfig: req.privateTransactionConfig,
                });
                const address = {
                    address: receipt.transactionReceipt.contractAddress,
                };
                const network = { [networkId]: address };
                contractJSON.networks = network;
                keychainPlugin.set(contractName, JSON.stringify(contractJSON));
            }
            const contract = new this.web3.eth.Contract(contractJSON.abi, contractJSON.networks[networkId].address);
            this.contracts[contractName] = contract;
        }
        else if (req.keychainId == undefined &&
            req.contractAbi == undefined &&
            req.contractAddress == undefined) {
            throw new Error(`${fnTag} Cannot invoke a contract without contract instance, the keychainId param is needed`);
        }
        contractInstance = this.contracts[contractName];
        if (req.contractAbi != undefined) {
            let abi;
            if (typeof req.contractAbi === "string") {
                abi = JSON.parse(req.contractAbi);
            }
            else {
                abi = req.contractAbi;
            }
            const { contractAddress } = req;
            contractInstance = new this.web3.eth.Contract(abi, contractAddress);
        }
        const isSafeToCall = await this.isSafeToCallContractMethod(contractInstance, req.methodName);
        if (!isSafeToCall) {
            throw new run_time_error_cjs_1.RuntimeError(`Invalid method name provided in request. ${req.methodName} does not exist on the Web3 contract object's "methods" property.`);
        }
        const methodRef = contractInstance.methods[req.methodName];
        cactus_common_1.Checks.truthy(methodRef, `${fnTag} YourContract.${req.methodName}`);
        const method = methodRef(...req.params);
        if (req.invocationType === typescript_axios_1.EthContractInvocationType.Call) {
            let callOutput;
            let success = false;
            if (req.privateTransactionConfig) {
                const data = method.encodeABI();
                let privKey;
                if (req.signingCredential.type ==
                    typescript_axios_1.Web3SigningCredentialType.CactusKeychainRef) {
                    const { keychainEntryKey, keychainId } = req.signingCredential;
                    const keychainPlugin = this.pluginRegistry.findOneByKeychainId(keychainId);
                    privKey = await keychainPlugin?.get(keychainEntryKey);
                }
                else {
                    privKey = req.signingCredential.secret;
                }
                const fnParams = {
                    to: contractInstance.options.address,
                    data,
                    privateFrom: req.privateTransactionConfig.privateFrom,
                    privateKey: privKey,
                    privateFor: req.privateTransactionConfig.privateFor,
                };
                if (!this.web3Quorum) {
                    throw new run_time_error_cjs_1.RuntimeError(`InvalidState: web3Quorum not initialized.`);
                }
                const privacyGroupId = this.web3Quorum.utils.generatePrivacyGroup(fnParams);
                this.log.debug("Generated privacyGroupId: ", privacyGroupId);
                callOutput = await this.web3Quorum.priv.call(privacyGroupId, {
                    to: contractInstance.options.address,
                    data,
                    // TODO: Update the "from" property of ICallOptions to be optional
                });
                success = true;
                this.log.debug(`Web3 EEA Call output: `, callOutput);
            }
            else {
                callOutput = await method.call();
                success = true;
            }
            return { success, callOutput };
        }
        else if (req.invocationType === typescript_axios_1.EthContractInvocationType.Send) {
            if ((0, model_type_guards_1.isWeb3SigningCredentialNone)(req.signingCredential)) {
                throw new Error(`${fnTag} Cannot deploy contract with pre-signed TX`);
            }
            const web3SigningCredential = req.signingCredential;
            const payload = method.send.request();
            const { params } = payload;
            const [transactionConfig] = params;
            if (req.gas == undefined) {
                req.gas = await this.web3.eth.estimateGas(transactionConfig);
            }
            transactionConfig.from = web3SigningCredential.ethAccount;
            transactionConfig.gas = req.gas;
            transactionConfig.gasPrice = req.gasPrice;
            transactionConfig.value = req.value;
            transactionConfig.nonce = req.nonce;
            const txReq = {
                transactionConfig,
                web3SigningCredential,
                consistencyStrategy: {
                    blockConfirmations: 0,
                    receiptType: typescript_axios_1.ReceiptType.NodeTxPoolAck,
                    timeoutMs: req.timeoutMs || 60000,
                },
                privateTransactionConfig: req.privateTransactionConfig,
            };
            const out = await this.transact(txReq);
            const success = out.transactionReceipt.status;
            const data = { success, out };
            // create IRunTransactionV1Exchange for transaction monitoring
            const receiptData = {
                request: req,
                response: out,
                timestamp: new Date(),
            };
            this.log.debug(`IRunTransactionV1Exchange created ${receiptData}`);
            this.txSubject.next(receiptData);
            return data;
        }
        else {
            throw new Error(`${fnTag} Unsupported invocation type ${req.invocationType}`);
        }
    }
    async transact(req) {
        const ctx = {
            prometheusExporter: this.prometheusExporter,
            pluginRegistry: this.pluginRegistry,
            logLevel: this.logLevel,
            web3: this.web3,
        };
        const runTransactionResponse = (0, transact_v1_impl_1.transactV1Impl)(ctx, req);
        return runTransactionResponse;
    }
    async deployContract(req) {
        const ctx = {
            pluginRegistry: this.pluginRegistry,
            prometheusExporter: this.prometheusExporter,
            web3: this.web3,
            logLevel: this.logLevel,
        };
        const res = await (0, deploy_contract_v1_keychain_1.deployContractV1Keychain)(ctx, req);
        const { status, contractAddress, contractName, contract } = res;
        if (status && contractAddress && contract) {
            this.contracts[contractName] = contract;
        }
        return res.deployResponse;
    }
    async deployContractNoKeychain(req) {
        const ctx = {
            pluginRegistry: this.pluginRegistry,
            prometheusExporter: this.prometheusExporter,
            web3: this.web3,
            logLevel: this.logLevel,
        };
        this.log.debug("Invoking deployContractV1NoKeychain()...");
        const res = (0, deploy_contract_v1_no_keychain_1.deployContractV1NoKeychain)(ctx, req);
        this.log.debug("Ran deployContractV1NoKeychain() OK");
        return res;
    }
    async signTransaction(req) {
        const { pluginRegistry, rpcApiHttpHost, logLevel } = this.options;
        const { keychainId, keychainRef, transactionHash } = req;
        const converter = new cactus_common_1.KeyConverter();
        const web3Provider = new web3_1.default.providers.HttpProvider(rpcApiHttpHost);
        const web3 = new web3_1.default(web3Provider);
        // Make sure the transaction exists on the ledger first...
        const transaction = await web3.eth.getTransaction(transactionHash);
        if (!transaction) {
            return typescript_optional_1.Optional.empty();
        }
        const keychain = pluginRegistry.findOneByKeychainId(keychainId);
        if (!keychain) {
            const msg = `Keychain for ID ${keychainId} not found.`;
            throw new cactus_common_1.CodedError(msg, exports.E_KEYCHAIN_NOT_FOUND);
        }
        const pem = await keychain.get(keychainRef);
        const pkRaw = converter.privateKeyAs(pem, cactus_common_1.KeyFormat.PEM, cactus_common_1.KeyFormat.Raw);
        const jsObjectSignerOptions = {
            privateKey: pkRaw,
            logLevel,
        };
        const jsObjectSigner = new cactus_common_1.JsObjectSigner(jsObjectSignerOptions);
        if (transaction !== undefined && transaction !== null) {
            const singData = jsObjectSigner.sign(transaction.input);
            const signDataHex = Buffer.from(singData).toString("hex");
            const resBody = { signature: signDataHex };
            return typescript_optional_1.Optional.ofNullable(resBody);
        }
        return typescript_optional_1.Optional.empty();
    }
    async getBalance(request) {
        const balance = await this.web3.eth.getBalance(request.address, request.defaultBlock);
        return { balance };
    }
    async getTransaction(request) {
        const transaction = await this.web3.eth.getTransaction(request.transactionHash);
        return { transaction };
    }
    async getPastLogs(request) {
        const logs = await this.web3.eth.getPastLogs(request);
        return { logs };
    }
    async getBlock(request) {
        const ctx = { logLevel: this.logLevel, web3: this.web3 };
        const getBlockV1Response = await (0, get_block_v1_http_1.getBlockV1Http)(ctx, request);
        this.log.debug("getBlockV1Response=%o", getBlockV1Response);
        return getBlockV1Response;
    }
    async getBesuRecord(request) {
        const fnTag = `${this.className}#getBesuRecord()`;
        //////////////////////////////////////////////
        let abi = [];
        const resp = {};
        const txHash = request.transactionHash;
        if (txHash) {
            const transaction = await this.web3.eth.getTransaction(txHash);
            if (transaction.input) {
                resp.transactionInputData = transaction.input;
                return resp;
            }
        }
        if (request.invokeCall) {
            if (request.invokeCall.contractAbi) {
                if (typeof request.invokeCall.contractAbi === "string") {
                    abi = JSON.parse(request.invokeCall.contractAbi);
                }
                else {
                    abi = request.invokeCall.contractAbi;
                }
            }
            const { contractAddress } = request.invokeCall;
            const contractInstance = new this.web3.eth.Contract(abi, contractAddress);
            const isSafeToCall = await this.isSafeToCallContractMethod(contractInstance, request.invokeCall.methodName);
            if (!isSafeToCall) {
                throw new run_time_error_cjs_1.RuntimeError(`Invalid method name provided in request. ${request.invokeCall.methodName} does not exist on the Web3 contract object's "methods" property.`);
            }
            const methodRef = contractInstance.methods[request.invokeCall.methodName];
            cactus_common_1.Checks.truthy(methodRef, `${fnTag} YourContract.${request.invokeCall.methodName}`);
            const method = methodRef(...request.invokeCall.params);
            if (request.invokeCall.invocationType === typescript_axios_1.EthContractInvocationType.Call) {
                const callOutput = await method.call();
                const res = {
                    callOutput,
                };
                return res;
            }
            else {
                throw new Error(`${fnTag} Unsupported invocation type ${request.invokeCall.invocationType}`);
            }
        }
        return resp;
    }
}
exports.PluginLedgerConnectorBesu = PluginLedgerConnectorBesu;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLWxlZGdlci1jb25uZWN0b3ItYmVzdS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvcGx1Z2luLWxlZGdlci1jb25uZWN0b3ItYmVzdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDJEQUFrRDtBQUNsRCwrQkFBaUQ7QUFHakQsNkRBQStDO0FBQy9DLCtCQUF3RTtBQU14RSxnREFBd0I7QUFHeEIsa0VBQTBEO0FBRzFELGtFQVNzQztBQUV0QywwREFHa0M7QUFFbEMsOERBVW9DO0FBRXBDLDBIQUFtSDtBQUNuSCxrSkFBeUk7QUFFekksc0VBTW9EO0FBT3BELDJFQXFCOEM7QUFFOUMsc0ZBQWlGO0FBQ2pGLDJEQUFrRTtBQUNsRSw4RkFBNEY7QUFDNUYsbUZBQStFO0FBQy9FLDRIQUdvRTtBQUNwRSxzRkFBZ0Y7QUFDaEYsOEVBQXlFO0FBQ3pFLHNGQUFpRjtBQUNqRixrRkFBNEU7QUFDNUUsc0ZBQWlGO0FBQ2pGLGlGQUF5RTtBQUN6RSw0RkFBcUY7QUFDckYsZ0dBR3NEO0FBQ3RELCtHQUFpRztBQUNqRyxzSEFBd0c7QUFDeEcsbUZBQTRFO0FBQzVFLGlGQUEyRTtBQUMzRSw2RUFBdUU7QUFDdkUsMEVBQXFFO0FBQ3JFLHVHQUFpRztBQUNqRyw2R0FBc0c7QUFDdEcsc0ZBQWdGO0FBQ2hGLHdFQUF1QztBQVExQixRQUFBLG9CQUFvQixHQUFHLDBDQUEwQyxDQUFDO0FBZS9FLE1BQWEseUJBQXlCO0lBd0NSO0lBNUJYLFVBQVUsQ0FBUztJQUM3QixrQkFBa0IsQ0FBcUI7SUFDN0IsR0FBRyxDQUFTO0lBQ1osUUFBUSxDQUFlO0lBQ3ZCLE1BQU0sQ0FBb0I7SUFDMUIsUUFBUSxDQUFlO0lBQ3ZCLElBQUksQ0FBTztJQUNYLFVBQVUsQ0FBbUI7SUFDN0IsTUFBTSxDQUF5QjtJQUMvQixRQUFRLENBQW9CO0lBQzVCLHVC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Z0JBQ3BFLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7YUFDaEMsQ0FBQyxDQUFDO1lBQ0gsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBQ0QsQ0FBQztZQUNDLE1BQU0sUUFBUSxHQUFHLElBQUkseUNBQWtCLENBQUM7Z0JBQ3RDLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7YUFDaEMsQ0FBQyxDQUFDO1lBQ0gsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBQ0QsQ0FBQztZQUNDLE1BQU0sUUFBUSxHQUFHLElBQUksaURBQXNCLENBQUM7Z0JBQzFDLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7YUFDaEMsQ0FBQyxDQUFDO1lBQ0gsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBQ0QsQ0FBQztZQUNDLE1BQU0sUUFBUSxHQUFHLElBQUksNENBQW1CLENBQUM7Z0JBQ3ZDLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7YUFDaEMsQ0FBQyxDQUFDO1lBQ0gsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBQ0QsQ0FBQztZQUNDLE1BQU0sUUFBUSxHQUFHLElBQUksaURBQXNCLENBQUM7Z0JBQzFDLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7YUFDaEMsQ0FBQyxDQUFDO1lBQ0gsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBQ0QsQ0FBQztZQUNDLE1BQU0sUUFBUSxHQUFHLElBQUksd0NBQWdCLENBQUM7Z0JBQ3BDLFNBQVMsRUFB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