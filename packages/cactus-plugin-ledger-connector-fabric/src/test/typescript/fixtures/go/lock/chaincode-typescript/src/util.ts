/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SHA256 } from "crypto-js";
import * as secp256k1 from "secp256k1";
export class AssetLockUtils {
  public constructor() {
    return;
  }
  public async sign(msg: string, privKey: string): Promise<string> {
    const signature = secp256k1.ecdsaSign(
      new Uint8Array(Buffer.from(SHA256(msg).toString(), `hex`)),
      Buffer.from(privKey, `hex`),
    ).signature;
    return this.bufArray2HexStr(signature);
  }

  public async verify(
    pubkey: string,
    signature: string,
    msg: any,
  ): Promise<boolean> {
    const sourceSignature = new Uint8Array(Buffer.from(signature, "hex"));
    const sourcePubkey = new Uint8Array(Buffer.from(pubkey, "hex"));
    return secp256k1.ecdsaVerify(
      sourceSignature,
      Buffer.from(SHA256(JSON.stringify(msg)).toString(), "hex"),
      sourcePubkey,
    );
  }

  public bufArray2HexStr(array: Uint8Array): string {
    return Buffer.from(array).toString("hex");
  }
}
