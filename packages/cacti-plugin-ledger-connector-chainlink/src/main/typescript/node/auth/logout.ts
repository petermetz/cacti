import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";

export async function logout(opts: {
  readonly level: Readonly<LogLevelDesc>;
  readonly protocol: Readonly<string>;
  readonly host: Readonly<string>;
  readonly port: Readonly<number>;
}): Promise<unknown> {
  const { level, host, port, protocol } = opts;
  const fn = "chainlink/node/auth/logout()";
  const log = LoggerProvider.getOrCreate({ level, label: fn });
  log.debug("ENTER protocol=%s host=%s, port=%d", protocol, host, port);

  const url = protocol.concat(host).concat(":").concat(port.toString(10));
  log.debug("url=%s", url);

  const res = await fetch("http://localhost:6688/sessions", {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "DELETE",
    mode: "cors",
  });

  // As an example a response JSON body looks like this:
  // {"data":{"type":"session","id":"sessionID","attributes":{"authenticated":false}}}
  const jsonBody = await res.json();
  log.debug("Status=%d Body=%s", jsonBody);

  return res;
}
