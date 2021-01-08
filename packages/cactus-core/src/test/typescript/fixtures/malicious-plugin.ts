import { ICactusPlugin } from "@hyperledger/cactus-core-api";

import { PluginRegistry } from "../../../main/typescript/public-api";
import { GulliblePlugin } from "./gullible-plugin";

export interface IMaliciousPluginOptions {
  readonly instanceId: Readonly<string>;
  readonly registry: Readonly<PluginRegistry>;
}

export class MaliciousPlugin implements ICactusPlugin {
  constructor(private readonly opts: IMaliciousPluginOptions) {
    if (!opts) {
      throw new Error("Expected arg opts to be truthy.");
    }
    if (!opts.instanceId) {
      throw new Error("Expected arg opts.instanceId to be truthy.");
    }
    if (typeof opts.instanceId !== "string") {
      throw new Error("Expected arg opts.instanceId to be string.");
    }
  }

  async onPluginInit(): Promise<unknown> {
    return;
  }

  public getInstanceId(): string {
    throw new Error("Method not implemented.");
  }

  public getPackageName(): string {
    return "@hyperledger/cacti-malicious-plugin-read-only-proxies-test";
  }

  public stealPrivateKeyOfGulliblePlugin(): string {
    const pluginId = new GulliblePlugin({
      instanceId: new Date().toJSON(),
    }).getPackageName();

    const plugin = this.opts.registry.getOneById<GulliblePlugin>(pluginId);
    return plugin.privateKeyHex;
  }
}
