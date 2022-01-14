export const ABI = [
  {
    inputs: [
      { internalType: "address", name: "_link", type: "address" },
      { internalType: "address", name: "_blockHashStore", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "keyHash",
        type: "bytes32",
      },
      { indexed: false, internalType: "uint256", name: "fee", type: "uint256" },
    ],
    name: "NewServiceAgreement",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "keyHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "seed",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "jobID",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      { indexed: false, internalType: "uint256", name: "fee", type: "uint256" },
      {
        indexed: false,
        internalType: "bytes32",
        name: "requestID",
        type: "bytes32",
      },
    ],
    name: "RandomnessRequest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "output",
        type: "uint256",
      },
    ],
    name: "RandomnessRequestFulfilled",
    type: "event",
  },
  {
    inputs: [],
    name: "PRESEED_OFFSET",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PROOF_LENGTH",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PUBLIC_KEY_OFFSET",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "callbacks",
    outputs: [
      { internalType: "address", name: "callbackContract", type: "address" },
      { internalType: "uint96", name: "randomnessFee", type: "uint96" },
      { internalType: "bytes32", name: "seedAndBlockNum", type: "bytes32" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "_proof", type: "bytes" }],
    name: "fulfillRandomnessRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[2]", name: "_publicKey", type: "uint256[2]" },
    ],
    name: "hashOfKey",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_sender", type: "address" },
      { internalType: "uint256", name: "_fee", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "onTokenTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_fee", type: "uint256" },
      { internalType: "address", name: "_oracle", type: "address" },
      {
        internalType: "uint256[2]",
        name: "_publicProvingKey",
        type: "uint256[2]",
      },
      { internalType: "bytes32", name: "_jobID", type: "bytes32" },
    ],
    name: "registerProvingKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "serviceAgreements",
    outputs: [
      { internalType: "address", name: "vRFOracle", type: "address" },
      { internalType: "uint96", name: "fee", type: "uint96" },
      { internalType: "bytes32", name: "jobID", type: "bytes32" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_recipient", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "withdrawableTokens",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export const ADDRESS = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B";
