export enum P2pMsgVersion {
  ONE = 1,
}

export interface IP2pMsgV1<T> {
  /**
   * A globally unique identifier of this message.
   */
  readonly id: Readonly<string>;
  /**
   * An ISO timestamp with timezone included such as this:
   * ```js
   * new Date().toISOString()
   * // "2024-07-17T19:37:33.055Z"
   * ```
   */
  readonly createAt: Readonly<string>;

  /**
   * Recipient patterns that can identify anything from multiple consortia or
   * just a single plugin instance within a single API server.
   */
  readonly recipients: Readonly<string[]>;

  /**
   * The sender of the message which can be any plugin instance in any API server
   * regardless of a consoritum having been configured or not.
   */
  readonly sender: Readonly<string>;

  readonly version: P2pMsgVersion.ONE;

  readonly data: T;
}
