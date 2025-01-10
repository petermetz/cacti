import axios, { AxiosInstance } from "axios";
import { HttpCookieAgent, HttpsCookieAgent } from "http-cookie-agent/http";
import { CookieJar } from "tough-cookie";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { IConnectionArgs } from "./i-connection-args";
import { IAuthArgs } from "./i-auth-args";

/**
 *
 * Example request:
 * ```json
 * 
 * {
 *   email: 'cacti-dev@cacti.example.com',
 *   password: 'cacti-dev@cacti.example.com',
 * }
 * ```
 *
 * Example response payload:
 * ```json

 * {"data":{"type":"session","id":"sessionID","attributes":{"authenticated":true}}}
 * ```
 * 
 * Example response headers
 * 
 * ```
 * {
*   "Response Headers": {
*     "headers": [
*       {
*         "name": "Set-Cookie",
*         "value": "clsession=MTczNjM3MzIwMHxEWDhFQVFMX2dBQUJFQUVRQUFCR180QUFBUVp6ZEhKcGJtY01EZ0FNWTJ4elpYTnphVzl1WDJsa0JuTjBjbWx1Wnd3aUFDQmpPRFptWW1GaU1qbG1ZekkwWVRKa09XUmxZakkwWkdJMU5EbGpOalUxWVE9PXxGsJJDj1EkR8BkR_fudHxkr_LPPdaaDjKK0b8Q95jp-g==; Expires=Fri, 07 Feb 2025 21:53:20 GMT; Max-Age=2592000; HttpOnly; SameSite=Strict"
*       },
*       {
*         "name": "Strict-Transport-Security",
*         "value": "max-age=5184000; includeSubDomains"
*       },
*       {
*         "name": "X-Content-Type-Options",
*         "value": "nosniff"
*       },
*       {
*         "name": "X-Dns-Prefetch-Control",
*         "value": "off"
*       },
*       {
*         "name": "X-Download-Options",
*         "value": "noopen"
*       },
*       {
*         "name": "X-Frame-Options",
*         "value": "DENY"
*       },
*       {
*         "name": "X-Ratelimit-Limit",
*         "value": "5"
*       },
*       {
*         "name": "X-Ratelimit-Remaining",
*         "value": "4"
*       },
*       {
*         "name": "X-Ratelimit-Reset",
*         "value": "1736373220"
*       },
*       {
*         "name": "X-Xss-Protection",
*         "value": "1; mode=block"
*       }
*     ]
*   }
* }
 * ```
 * @param opts 
 * @returns 
 */
export async function login(opts: {
  readonly level: Readonly<LogLevelDesc>;
  readonly connectionArgs: Readonly<IConnectionArgs>;
  readonly authArgs: Readonly<IAuthArgs>;
}): Promise<{ readonly axiosInstance: Readonly<AxiosInstance> }> {
  const fn = "chainlink/node/auth/login()";
  const { level = "WARN" } = opts;
  const log = LoggerProvider.getOrCreate({ level, label: fn });

  const { connectionArgs, authArgs } = opts;
  const { host, port, protocol } = connectionArgs;
  const { email, password } = authArgs;

  log.debug("ENTER protocol=%s host=%s, port=%d", protocol, host, port);

  const baseURL = protocol
    .concat("://")
    .concat(host)
    .concat(":")
    .concat(port.toString(10));

  const loginPath = "/sessions";

  log.debug("url=%s", baseURL);

  const postBody = {
    email,
    password,
  };

  const jar = new CookieJar();

  const axiosInstance = axios.create({
    timeout: 10000,
    headers: {
      "Content-Type": "application/json", // Specify JSON payload
    },
    baseURL,
    httpAgent: new HttpCookieAgent({ cookies: { jar } }),
    httpsAgent: new HttpsCookieAgent({ cookies: { jar } }),
  });

  log.debug("Sending login request to %s ...", baseURL);

  const response = await axiosInstance.post(loginPath, postBody);

  log.debug("Received login response from Chainlink node OK.");

  // {"data":{"type":"session","id":"sessionID","attributes":{"authenticated":true}}}
  const isAuthenticated = response.data.data.attributes.authenticated;
  if (!isAuthenticated) {
    log.debug("response.data.attributes.authenticated is false. Crashing...");
    throw new Error("Authentication to Chainlink Node API failed:", {
      cause: response,
    });
  }
  log.debug("Validated the response for data.attributes.authenticated flag OK");

  return { axiosInstance };
}
