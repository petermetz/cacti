export const ABI = [
  {
    inputs: [{ internalType: "bytes", name: "err", type: "bytes" }],
    name: "CustomError",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getConfigDetails",
    outputs: [
      { internalType: "uint32", name: "version", type: "uint32" },
      { internalType: "uint32", name: "blockNumber", type: "uint32" },
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "blessVoteAddr",
                type: "address",
              },
              {
                internalType: "address",
                name: "curseVoteAddr",
                type: "address",
              },
              {
                internalType: "address",
                name: "curseUnvoteAddr",
                type: "address",
              },
              {
                internalType: "uint8",
                name: "blessWeight",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "curseWeight",
                type: "uint8",
              },
            ],
            internalType: "structRMN.Voter[]",
            name: "voters",
            type: "tuple[]",
          },
          {
            internalType: "uint16",
            name: "blessWeightThreshold",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "curseWeightThreshold",
            type: "uint16",
          },
        ],
        internalType: "structRMN.Config",
        name: "config",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "commitStore",
            type: "address",
          },
          { internalType: "bytes32", name: "root", type: "bytes32" },
        ],
        internalType: "structIRMN.TaggedRoot",
        name: "",
        type: "tuple",
      },
    ],
    name: "isBlessed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes16", name: "subject", type: "bytes16" }],
    name: "isCursed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isCursed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "curseVoteAddr",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "cursesHash",
            type: "bytes32",
          },
          { internalType: "bool", name: "forceUnvote", type: "bool" },
        ],
        internalType: "structRMN.UnvoteToCurseRecord[]",
        name: "",
        type: "tuple[]",
      },
      { internalType: "bytes16", name: "subject", type: "bytes16" },
    ],
    name: "ownerUnvoteToCurse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "curseVoteAddr",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "cursesHash",
            type: "bytes32",
          },
          { internalType: "bool", name: "forceUnvote", type: "bool" },
        ],
        internalType: "structRMN.UnvoteToCurseRecord[]",
        name: "",
        type: "tuple[]",
      },
    ],
    name: "ownerUnvoteToCurse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "err", type: "bytes" }],
    name: "setRevert",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "to", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "voteToCurse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "bytes16", name: "subject", type: "bytes16" },
    ],
    name: "voteToCurse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
