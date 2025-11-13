import * as LitJsSdk from "@lit-protocol/lit-node-client";

const accessControlConditions = [
  {
    contractAddress:
      "ipfs://Put here your lit action cid v0 example: QmeyXBhrg1mR.....6B you can use pinata to pin your action and get the cid",
    standardContractType: "LitAction",
    chain: "ethereum",
    method: "go", // This is the method name that will be called in your lit action
    parameters: [":litParam:a", ":litParam:b"], // These are the parameters that will be passed to your lit action
    returnValueTest: {
      comparator: "=",
      value: "true", // This is the value that needs to be returned by your lit action
    },
  },
];

const client = new LitJsSdk.LitNodeClient({
  litNetwork: "datil-dev",
  debug: true,
  checkNodeAttestation: false,
});

const privateKey =
  "0xa27799b81a0a805d06e1f4f1e3640e2cbe16f02306bcfd11901d0e2b2e10925f";

export { accessControlConditions, client, privateKey };
