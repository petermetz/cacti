import test, { Test } from "tape";
import { ObservableMembrane } from "observable-membrane";

import {
  PluginRegistry,
  IPluginRegistryOptions,
} from "../../../../main/typescript/public-api";

import { GulliblePlugin } from "../../fixtures/gullible-plugin";
import { MaliciousPlugin } from "../../fixtures/malicious-plugin";

test("malicious plugin cannot swap out other's public key", (t: Test) => {
  const gulliblePluginOrig = new GulliblePlugin({
    instanceId: new Date().toJSON(),
  });
  const origPubKeyHex = gulliblePluginOrig.publicKeyHex;

  const regOptions: IPluginRegistryOptions = {
    logLevel: "INFO",
  };

  const reg = new PluginRegistry(regOptions);
  reg.add(gulliblePluginOrig);

  // check if we can overwrite original properties through the read-only proxy
  const pluginId = gulliblePluginOrig.getPackageName();
  const readOnlyProxy = reg.getOneById<GulliblePlugin>(pluginId);
  readOnlyProxy.publicKeyHex = "malicious-code-or-something";
  t.equal(
    readOnlyProxy.publicKeyHex,
    origPubKeyHex,
    "read-only proxy does not allow writes on original plugin instance",
  );

  // check if we can overwrite original properties by unwrapping the read-only proxy
  const unwrapped = reg.membrane.unwrapProxy(readOnlyProxy) as GulliblePlugin;
  unwrapped.publicKeyHex = "malicious-code-or-something";
  t.equal(
    unwrapped.publicKeyHex,
    origPubKeyHex,
    "Unwrapped read-only proxy does not provide write access to original property value",
  );

  // check if we can overwrite original properties by side-stepping the
  // PluginRegistry get*() methods and the read-only proxies entirely via
  // obtaining direct references to the original objects
  const directReference = reg.plugins[0] as GulliblePlugin;
  directReference.publicKeyHex = "attackers-public-key-for-MITM";
  t.equal(
    directReference.publicKeyHex,
    origPubKeyHex,
    "Gaining access to the direct (non-proxy) reference does not result in writes",
  );

  t.end();
});

test("malicious plugin cannot steal private key of other plugin", (t: Test) => {
  const fakePrivateKey = "swapped-out-real-private-key-with-this";

  const regOptions: IPluginRegistryOptions = {
    logLevel: "TRACE",
    membrane: new ObservableMembrane({
      valueMutated(obj, key) {
        if (obj instanceof GulliblePlugin) {
          return { privateKeyHex: fakePrivateKey };
        } else {
          return key;
        }
      },
    }),
  };
  const registry = new PluginRegistry(regOptions);

  const maliciousPlugin = new MaliciousPlugin({
    instanceId: new Date().toJSON(),
    registry,
  });
  registry.add(maliciousPlugin);

  const gulliblePlugin = new GulliblePlugin({
    instanceId: new Date().toJSON(),
  });
  registry.add(gulliblePlugin);

  const privKeyOrig = gulliblePlugin.privateKeyHex;

  const stolenPrivKey = maliciousPlugin.stealPrivateKeyOfGulliblePlugin();
  t.ok(stolenPrivKey, "Stolen private key is truthy");
  t.equal(typeof stolenPrivKey, "string", "Stolen private key is a string");
  t.notEqual(stolenPrivKey, privKeyOrig, "Stolen priv key is NOT the original");
  t.equal(stolenPrivKey, fakePrivateKey, "Stolen priv key EQUALS the fake");

  t.end();
});
