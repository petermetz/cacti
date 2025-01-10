export interface IChain {
  id: string;
  __typename: string;
}

export interface IEthKey {
  address: string;
  chain: IChain;
  createdAt: string;
  ethBalance: string;
  isDisabled: boolean;
  linkBalance: string | null;
  __typename: string;
}

export interface IEthKeysPayload {
  results: IEthKey[];
  __typename: string;
}

export interface IEthKeysData {
  ethKeys: IEthKeysPayload;
}

export interface IEthKeysDto {
  data: IEthKeysData;
}
