import { encryptString } from "@lit-protocol/encryption";
import fs from "fs";
import { accessControlConditions, client } from "./common";

await client.connect();

const encrypted = await encryptString(
  {
    accessControlConditions,
    dataToEncrypt: "Je t'aime IKRAM!",
  },
  client
);

console.log("Encrypted Successfully: ", encrypted);
fs.writeFileSync("encrypted.json", JSON.stringify(encrypted, null, 2));
process.exit(0);
