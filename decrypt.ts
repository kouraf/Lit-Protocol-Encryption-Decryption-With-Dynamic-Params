import { decryptToString } from "@lit-protocol/encryption";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

import { accessControlConditions, client, privateKey } from "./common";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";

import encryptResponse from "./encrypted.json";

await client.connect();

const wallet = new ethers.Wallet(privateKey);

const nonce =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

const siweMessage = {
  address: wallet.address,
  nonce,
  expirationTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour
  uri: "http://localhost:3001",
  domain: "localhost",
  statement: "I want to generate an authsig with this wallet",
  version: "1",
  chainId: 1,
  resources: [
    `litParam:a:${LitJsSdk.uint8arrayToString(
      LitJsSdk.uint8arrayFromString("a", "utf8"),
      "base64url"
    )}`,
    `litParam:b:${LitJsSdk.uint8arrayToString(
      LitJsSdk.uint8arrayFromString("b", "utf8"),
      "base64url"
    )}`,
  ],
};

const rawMessage = new SiweMessage(siweMessage);

const message = rawMessage.prepareMessage();

const signature = await wallet.signMessage(message);

const authSig = {
  sig: signature,
  derivedVia: "web3.eth.personal.sign",
  signedMessage: message,
  address: wallet.address,
};

const decrypted = await decryptToString(
  {
    accessControlConditions,
    ciphertext: encryptResponse.ciphertext,
    dataToEncryptHash: encryptResponse.dataToEncryptHash,
    chain: "ethereum",
    authSig,
  },
  client
);

console.log("Decrypted Successfully: ");
console.log(decrypted);
process.exit(0);
