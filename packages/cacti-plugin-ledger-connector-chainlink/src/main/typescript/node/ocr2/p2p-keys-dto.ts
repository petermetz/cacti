export interface IP2PKey {
  id: string;
  peerID: string;
  publicKey: string;
  __typename: string;
}

export interface IP2PKeysPayload {
  results: IP2PKey[];
  __typename: string;
}

export interface IP2pKeysData {
  p2pKeys: IP2PKeysPayload;
}

export interface IP2pKeysDto {
  data: IP2pKeysData;
}
