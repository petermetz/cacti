/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from "fabric-contract-api";
import { Asset } from "./asset";
import { AssetLockUtils } from "./util";

const util = new AssetLockUtils();
@Info({
  title: "LockAsset",
  description: "Smart contract for locking assets",
})
export class AssetLockContract extends Contract {
  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {
    const assets: Asset[] = [];

    for (const asset of assets) {
      asset.docType = "lock-asset";
      await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
      console.info(`Asset ${asset.ID} initialized`);
    }
  }

  // CreateAsset issues a new asset to the world state with given details.
  @Transaction()
  public async CreateAsset(ctx: Context, id: string): Promise<void> {
    const asset = {
      ID: id,
      Nonce: 0,
      IsLock: false,
    };
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
  }

  // ReadAsset returns the asset stored in the world state with given id.
  @Transaction(false)
  public async ReadAsset(ctx: Context, id: string): Promise<string> {
    const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return assetJSON.toString();
  }

  // UpdateAsset updates an existing asset in the world state with provided parameters.
  @Transaction()
  public async LockAsset(
    ctx: Context,
    id: string,
    signature: string,
  ): Promise<void> {
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }
    const asset = await this.ReadAsset(ctx, id);
    if (!util.verify(signature, JSON.parse(asset), id)) {
      throw new Error(`The asset ${id}, signature invalid for unlock`);
    }
    // overwriting original asset with new asset
    const assetJson = JSON.parse(asset);
    const updatedAsset = {
      ID: id,
      isLock: true,
      Nonce: assetJson.Nonce + 1,
    };
    return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
  }
  @Transaction()
  public async unlock(ctx: Context, id: string, signature: any): Promise<void> {
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }
    const asset = await this.ReadAsset(ctx, id);
    if (!util.verify(signature, JSON.parse(asset), id)) {
      throw new Error(`The asset ${id}, signature invalid for lock`);
    }
    // overwriting original asset with new asset
    const assetJson = JSON.parse(asset);
    // overwriting original asset with new asset
    const updatedAsset = {
      ID: id,
      isLock: false,
      Nonce: assetJson.Nonce + 1,
    };
    return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
  }

  // DeleteAsset deletes an given asset from the world state.
  @Transaction()
  public async DeleteAsset(
    ctx: Context,
    id: string,
    signature: string,
  ): Promise<void> {
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }
    const asset = await this.ReadAsset(ctx, id);
    if (!util.verify(signature, JSON.parse(asset), id)) {
      throw new Error(`The asset ${id}, signature invalid for delete`);
    }
    return ctx.stub.deleteState(id);
  }

  // AssetExists returns true when asset with given ID exists in world state.
  @Transaction(false)
  @Returns("boolean")
  public async AssetExists(ctx: Context, id: string): Promise<boolean> {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON && assetJSON.length > 0;
  }

  // GetAllAssets returns all assets found in the world state.
  @Transaction(false)
  @Returns("string")
  public async GetAllAssets(ctx: Context): Promise<string> {
    const allResults = [];
    // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8",
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push({ Key: result.value.key, Record: record });
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }
}
