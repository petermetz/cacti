import { ICactusPlugin } from "@hyperledger/cactus-core-api/src/main/typescript/public-api";

export interface IGulliblePluginOptions {
  readonly instanceId: Readonly<string>;
}

export class GulliblePlugin implements ICactusPlugin {
  constructor(private readonly opts: IGulliblePluginOptions) {
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
    return this.opts.instanceId;
  }

  public privateKeyHex: string = "a-very-private-private-key";

  public publicKeyHex: string = "a-very-important-public-key-for-validation";

  public getPackageName(): string {
    return "@hyperledger/cacti-gullible-plugin-read-only-proxies-test";
  }
}
