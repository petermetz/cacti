import { AxiosInstance, AxiosResponse } from "axios";
import safeStringify from "fast-safe-stringify";

import {
  Logger,
  LoggerProvider,
  LogLevelDesc,
} from "@hyperledger/cactus-common";

import { IConnectionArgs } from "./auth/i-connection-args";
import { IAuthArgs } from "./auth/i-auth-args";
import { login } from "./auth/login";
import { IOcr2KeyBundlesDto } from "./ocr2/ocr2-key-bundles-dto";
import { IEthKeysDto } from "./ocr2/eth-keys-dto";
import { IP2pKeysDto } from "./ocr2/p2p-keys-dto";

export interface IChainlinkApiClient {
  createJob(opts: { readonly jobSpecToml: Readonly<string> }): Promise<{
    readonly response: Readonly<AxiosResponse<unknown, unknown>>;
  }>;

  getOcr2KeyBundles(opts: {
    readonly offset: Readonly<number>;
    readonly limit: Readonly<number>;
  }): Promise<{
    readonly offset: Readonly<number>;
    readonly limit: Readonly<number>;
    readonly response: Readonly<AxiosResponse<IOcr2KeyBundlesDto, unknown>>;
  }>;

  getEthKeys(opts: {
    readonly offset: Readonly<number>;
    readonly limit: Readonly<number>;
  }): Promise<{
    readonly offset: Readonly<number>;
    readonly limit: Readonly<number>;
    readonly response: Readonly<AxiosResponse<IEthKeysDto, unknown>>;
  }>;

  getP2pKeys(): Promise<{
    readonly response: Readonly<AxiosResponse<IP2pKeysDto, unknown>>;
  }>;
}

class ChainlinkApiClient implements IChainlinkApiClient {
  private readonly log: Logger;
  constructor(
    private readonly opts: {
      readonly logLevel: Readonly<LogLevelDesc>;
      readonly axiosInstance: Readonly<AxiosInstance>;
      readonly connectionArgs: Readonly<IConnectionArgs>;
    },
  ) {
    const { logLevel = "WARN" } = opts;
    this.log = LoggerProvider.getOrCreate({
      label: "ChainlinkApiClient",
      level: logLevel,
    });
  }

  /**
   * Example response JSON payload:
   * ```json
   * {
   *   "data": {
   *     "ethKeys": {
   *       "results": [
   *         {
   *           "address": "0xbcfcDc02F569fbf4D4BDA8914749a9f8EaD63fcf",
   *           "chain": { "id": "90000002", "__typename": "Chain" },
   *           "createdAt": "2025-01-10T04:29:38.801785Z",
   *           "ethBalance": "0.000000000000000000",
   *           "isDisabled": false,
   *           "linkBalance": null,
   *           "__typename": "EthKey"
   *         },
   *         {
   *           "address": "0xe89c78416024649b6fed028072d4E2eDB9E989B3",
   *           "chain": { "id": "90000001", "__typename": "Chain" },
   *           "createdAt": "2025-01-10T04:29:37.87087Z",
   *           "ethBalance": "0.000000000000000000",
   *           "isDisabled": false,
   *           "linkBalance": null,
   *           "__typename": "EthKey"
   *         }
   *       ],
   *       "__typename": "EthKeysPayload"
   *     }
   *   }
   * }
   *```
   * @param opts
   * @returns
   */
  public async getEthKeys(opts: {
    readonly offset: Readonly<number>;
    readonly limit: Readonly<number>;
  }): Promise<{
    readonly offset: Readonly<number>;
    readonly limit: Readonly<number>;
    readonly response: Readonly<AxiosResponse<IEthKeysDto, unknown>>;
  }> {
    const { offset = 0, limit = 1000 } = opts;
    const queryPath = "/query";

    const postBody = {
      operationName: "FetchETHKeys",
      variables: {},
      query:
        "fragment ETHKeysPayload_ResultsFields on EthKey {\n  address\n  chain {\n    id\n    __typename\n  }\n  createdAt\n  ethBalance\n  isDisabled\n  linkBalance\n  __typename\n}\n\nquery FetchETHKeys {\n  ethKeys {\n    results {\n      ...ETHKeysPayload_ResultsFields\n      __typename\n    }\n    __typename\n  }\n}\n",
    };
    try {
      const response = await this.opts.axiosInstance.post(queryPath, postBody);

      const { errors } = response.data;
      if (Array.isArray(errors) && errors.length > 0) {
        this.log.debug("FetchETHKeys fail:", safeStringify(errors));
        throw new Error("FetchETHKeys call: ", { cause: errors });
      }

      return { offset, limit, response };
    } catch (cause: unknown) {
      this.log.debug("FetchETHKeys fail:", safeStringify(cause));
      throw new Error("FetchETHKeys Chainlink request fail:", { cause });
    }
  }

  /**
   * Example response JSON payload:
   * ```json
   *{
   *  "data": {
   *    "ocr2KeyBundles": {
   *      "results": [
   *        {
   *          "id": "16f2664c2663530fad45968bdade52e0d5d57cc1fc72d1d9cac22360cafc218c",
   *          "chainType": "EVM",
   *          "configPublicKey": "ocr2cfg_evm_81496cdcc7f0178b186b559c746d66eff66058306d67f820f028d6af3b99f16c",
   *          "onChainPublicKey": "ocr2on_evm_bef8eb8bf2e6540e71bb88926325618653b4e8f4",
   *          "offChainPublicKey": "ocr2off_evm_9681a3937fce73bf78a5e90d276fe2a472fc4244ac9a774e36a89953d7074bea",
   *          "__typename": "OCR2KeyBundle"
   *        }
   *      ],
   *      "__typename": "OCR2KeyBundlesPayload"
   *    }
   *  }
   *}
   * ```
   * @param opts
   * @returns
   */
  public async getOcr2KeyBundles(opts: {
    readonly offset: Readonly<number>;
    readonly limit: Readonly<number>;
  }): Promise<{
    readonly offset: Readonly<number>;
    readonly limit: Readonly<number>;
    readonly response: Readonly<AxiosResponse<IOcr2KeyBundlesDto, unknown>>;
  }> {
    const { offset = 0, limit = 1000 } = opts;
    const queryPath = "/query";

    const postBody = {
      operationName: "FetchOCR2KeyBundles",
      variables: {},
      query:
        "fragment OCR2KeyBundlesPayload_ResultsFields on OCR2KeyBundle {\n  id\n  chainType\n  configPublicKey\n  onChainPublicKey\n  offChainPublicKey\n  __typename\n}\n\nquery FetchOCR2KeyBundles {\n  ocr2KeyBundles {\n    results {\n      ...OCR2KeyBundlesPayload_ResultsFields\n      __typename\n    }\n    __typename\n  }\n}\n",
    };
    try {
      const response = await this.opts.axiosInstance.post(queryPath, postBody);

      const { errors } = response.data;
      if (Array.isArray(errors) && errors.length > 0) {
        this.log.debug("FetchOCR2KeyBundles fail:", safeStringify(errors));
        throw new Error("FetchOCR2KeyBundles call: ", { cause: errors });
      }

      return { offset, limit, response };
    } catch (cause: unknown) {
      this.log.debug("FetchOCR2KeyBundles fail:", safeStringify(cause));
      throw new Error("FetchOCR2KeyBundles Chainlink request fail:", { cause });
    }
  }

  /**
   * Example response JSON payload:
   * ```json
   * {
   *   "data": {
   *     "jobs": {
   *       "results": [
   *         {
   *           "id": "1",
   *           "name": "bootstrap-besu",
   *           "externalJobID": "00042e7d-6e69-45f4-9740-d928464867ab",
   *           "createdAt": "2025-01-08T19:56:17.968835Z",
   *           "spec": { "__typename": "BootstrapSpec" },
   *           "__typename": "Job"
   *         }
   *       ],
   *       "metadata": { "total": 1, "__typename": "PaginationMetadata" },
   *       "__typename": "JobsPayload"
   *     }
   *   }
   * }
   *
   * ```
   * @param opts
   * @returns
   */
  public async getJobs(opts: {
    readonly offset: Readonly<number>;
    readonly limit: Readonly<number>;
  }): Promise<{
    readonly offset: Readonly<number>;
    readonly limit: Readonly<number>;
    readonly response: Readonly<AxiosResponse<unknown, unknown>>;
  }> {
    const { offset = 0, limit = 1000 } = opts;
    const queryPath = "/query";

    const postBody = {
      operationName: "FetchJobs",
      variables: { offset, limit },
      query:
        "fragment JobsPayload_ResultsFields on Job {\n  id\n  name\n  externalJobID\n  createdAt\n  spec {\n    __typename\n    ... on OCRSpec {\n      contractAddress\n      keyBundleID\n      transmitterAddress\n      __typename\n    }\n  }\n  __typename\n}\n\nquery FetchJobs($offset: Int, $limit: Int) {\n  jobs(offset: $offset, limit: $limit) {\n    results {\n      ...JobsPayload_ResultsFields\n      __typename\n    }\n    metadata {\n      total\n      __typename\n    }\n    __typename\n  }\n}\n",
    };
    try {
      const response = await this.opts.axiosInstance.post(queryPath, postBody);

      const { errors } = response.data;
      if (Array.isArray(errors) && errors.length > 0) {
        this.log.debug("FetchJobs fail:", safeStringify(errors));
        throw new Error("FetchJobs call failed: ", { cause: errors });
      }

      return { offset, limit, response };
    } catch (cause: unknown) {
      this.log.debug("FetchJobs fail:", safeStringify(cause));
      throw new Error("FetchJobs Chainlink node request failed: ", { cause });
    }
  }

  /**
   * Example response JSON payload:
   * ```json
   * {"data":{"createJob":{"job":{"id":"5","__typename":"Job"},"__typename":"CreateJobSuccess"}}}
   * ```
   *
   * Example of failure payload (HTTP statuscode will be still 200 despite the errors)
   * ```json
   * {
   *   "errors": [
   *     {
   *       "message": "CreateJobFailed: no EVM key matching: \"62b8b98a02bf1f1111d3b9e9ad72ceccc40244ad9a5a03e690ee5e1954b225b6\": no such transmitter key exists",
   *       "path": ["createJob"]
   *     }
   *   ],
   *   "data": null
   * }
   * ```
   *
   * Another (different) example of failing:
   * ```json
   * {
   *     "data": {
   *         "data": {
   *           "createJob": {
   *             "errors": [
   *               {
   *                 "path": "TOML spec",
   *                 "message": "failed to parse TOML: (3, 3): unmarshal text: invalid UUID length: 40",
   *                 "code": "INVALID_INPUT",
   *                 "__typename": "InputError"
   *               }
   *             ],
   *             "__typename": "InputErrors"
   *           }
   *         }
   *       }
   *
   * }
   * ```
   * @param opts
   * @returns
   */
  public async createJob(opts: {
    readonly jobSpecToml: Readonly<string>;
  }): Promise<{
    readonly response: Readonly<AxiosResponse<unknown, unknown>>;
  }> {
    const queryPath = "/query";

    const postBody = {
      operationName: "CreateJob",
      variables: {
        input: {
          TOML: opts.jobSpecToml,
        },
      },
      query:
        "mutation CreateJob($input: CreateJobInput!) {\n  createJob(input: $input) {\n    ... on CreateJobSuccess {\n      job {\n        id\n        __typename\n      }\n      __typename\n    }\n    ... on InputErrors {\n      errors {\n        path\n        message\n        code\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
    };
    const response = await this.opts.axiosInstance.post(queryPath, postBody);

    const { errors } = response.data;
    if (Array.isArray(errors) && errors.length > 0) {
      this.log.debug("CreateJob fail1:", safeStringify(errors));
      throw new Error("CreateJob GraphQL action failed: ", { cause: errors });
    }

    const { errors: errors2 } = response.data.data?.createJob;
    if (Array.isArray(errors) && errors.length > 0) {
      this.log.debug("CreateJob fail2:", safeStringify(errors));
      throw new Error("CreateJob GraphQL action failed: ", { cause: errors2 });
    }

    return { response };
  }

  /**
   * Example response JSON payload:
   * ```json
   * {
   *   "data": {
   *     "createP2PKey": {
   *       "p2pKey": {
   *         "id": "12D3KooWBuix2Xz7Y912HXnwSonfLCcd8DpEBVTbtNrHAPqqTtuE",
   *         "peerID": "p2p_12D3KooWBuix2Xz7Y912HXnwSonfLCcd8DpEBVTbtNrHAPqqTtuE",
   *         "publicKey": "1f16c65642d9500f9893477389615208ed20843ea7fc0bbfd904498181301111",
   *         "__typename": "P2PKey"
   *       },
   *       "__typename": "CreateP2PKeySuccess"
   *     }
   *   }
   * }
   *
   * ```
   * @param opts
   * @returns
   */
  public async createP2pKey(): Promise<{
    readonly response: Readonly<AxiosResponse<unknown, unknown>>;
  }> {
    const queryPath = "/query";

    const postBody = {
      operationName: "CreateP2PKey",
      variables: {},
      query:
        "fragment P2PKeysPayload_ResultsFields on P2PKey {\n  id\n  peerID\n  publicKey\n  __typename\n}\n\nmutation CreateP2PKey {\n  createP2PKey {\n    ... on CreateP2PKeySuccess {\n      p2pKey {\n        ...P2PKeysPayload_ResultsFields\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
    };
    const response = await this.opts.axiosInstance.post(queryPath, postBody);

    const { errors } = response.data;
    if (Array.isArray(errors) && errors.length > 0) {
      this.log.debug("CreateP2PKey fail:", safeStringify(errors));
      throw new Error("CreateP2PKey call: ", { cause: errors });
    }

    return { response };
  }

  /**
   * Example response JSON payload
   * ```json
   * {
   *   "data": {
   *     "p2pKeys": {
   *       "results": [
   *         {
   *           "id": "12D3KooWL2a3mYnXu4BVC6NxfParpGn2WpK7c3hCmaayLkvkuLwm",
   *           "peerID": "p2p_12D3KooWL2a3mYnXu4BVC6NxfParpGn2WpK7c3hCmaayLkvkuLwm",
   *           "publicKey": "97b5457c4b71d125dd4fdffc2bb5ae92c8788ab7506c2fa5554bcf2b4fd6bc44",
   *           "__typename": "P2PKey"
   *         },
   *         {
   *           "id": "12D3KooWBoRkhJD4LGXhQUii2YjHoGz5psWsmfLqFeotKkVy2FEc",
   *           "peerID": "p2p_12D3KooWBoRkhJD4LGXhQUii2YjHoGz5psWsmfLqFeotKkVy2FEc",
   *           "publicKey": "1d79d8d6d5d6e652cae65500ef05d4b3c2f2762a73fdad51a991b4688d081af5",
   *           "__typename": "P2PKey"
   *         },
   *         {
   *           "id": "12D3KooWBdfPLvuyR1Zr2igpJps4vfZczjucqGxGCvqt55XC4ZMC",
   *           "peerID": "p2p_12D3KooWBdfPLvuyR1Zr2igpJps4vfZczjucqGxGCvqt55XC4ZMC",
   *           "publicKey": "1af973da46a6d3742ec815ef8b9b3dda5aa4ad6e8436bf3b09d41a095d3a41fb",
   *           "__typename": "P2PKey"
   *         },
   *         {
   *           "id": "12D3KooWBuix2Xz7Y912HXnwSonfLCcd8DpEBVTbtNrHAPqqTtuE",
   *           "peerID": "p2p_12D3KooWBuix2Xz7Y912HXnwSonfLCcd8DpEBVTbtNrHAPqqTtuE",
   *           "publicKey": "1f16c65642d9500f9893477389615208ed20843ea7fc0bbfd904498181301111",
   *           "__typename": "P2PKey"
   *         }
   *       ],
   *       "__typename": "P2PKeysPayload"
   *     }
   *   }
   * }
   * ```
   * @param opts
   * @returns
   */
  public async getP2pKeys(): Promise<{
    readonly response: Readonly<AxiosResponse<IP2pKeysDto, unknown>>;
  }> {
    const queryPath = "/query";

    const postBody = {
      operationName: "FetchP2PKeys",
      variables: {},
      query:
        "fragment P2PKeysPayload_ResultsFields on P2PKey {\n  id\n  peerID\n  publicKey\n  __typename\n}\n\nquery FetchP2PKeys {\n  p2pKeys {\n    results {\n      ...P2PKeysPayload_ResultsFields\n      __typename\n    }\n    __typename\n  }\n}\n",
    };
    const response = await this.opts.axiosInstance.post(queryPath, postBody);

    const { errors } = response.data;
    if (Array.isArray(errors) && errors.length > 0) {
      this.log.debug("FetchP2PKeys fail:", safeStringify(errors));
      throw new Error("FetchP2PKeys call: ", { cause: errors });
    }

    return { response };
  }
}

export async function createApiclient(opts: {
  readonly level: Readonly<LogLevelDesc>;
  readonly connectionArgs: Readonly<IConnectionArgs>;
  readonly authArgs: Readonly<IAuthArgs>;
}): Promise<{ readonly apiClient: Readonly<IChainlinkApiClient> }> {
  const fn = "chainlink/node/createApiclient()";
  const { level = "WARN" } = opts;
  const log = LoggerProvider.getOrCreate({ level, label: fn });

  const { connectionArgs, authArgs } = opts;
  log.debug("ENTER connectionArgs=%s", JSON.stringify(connectionArgs));

  try {
    const { axiosInstance } = await login({ level, authArgs, connectionArgs });
    log.debug("Created ChainlinkApiClient OK.");
    const apiClient = new ChainlinkApiClient({
      logLevel: opts.level,
      axiosInstance,
      connectionArgs,
    });
    return { apiClient };
  } catch (cause: unknown) {
    throw new Error("Could not log in to Chainlink node.", { cause });
  }
}
