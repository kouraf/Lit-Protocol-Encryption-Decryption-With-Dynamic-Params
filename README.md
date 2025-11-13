# Lit Protocol Encryption/Decryption with Lit Actions

This project demonstrates how to use Lit Protocol for encryption and decryption with dynamic parameters passed through Lit Actions.

## Overview

This codebase allows you to:

- Encrypt data using Lit Protocol's access control conditions
- Decrypt data by passing dynamic parameters to a Lit Action
- Use a server endpoint to validate parameters and control decryption access

## Prerequisites

- [Bun](https://bun.sh/) runtime installed
- Node.js dependencies installed (`bun install`)
- A service to create a public tunnel (e.g., ngrok, Cloudflare Tunnel, etc.)
- Access to IPFS for hosting the Lit Action (e.g., Pinata, Infura, etc.)

## Setup Instructions

### 1. Start the Server

First, start the local server that will handle requests from the Lit Action:

```bash
bun run server
```

The server will run on `http://localhost:3001` and handle POST requests to `/api/action`.

### 2. Create a Public Tunnel

Since Lit Actions need to reach your server from the internet, you need to create a public tunnel. You can use:

- **ngrok**: `ngrok http 3001`
- **Cloudflare Tunnel**: Follow Cloudflare's documentation
- Any other tunneling service

Once you have the public URL (e.g., `https://abc123.ngrok.io`), proceed to the next step.

### 3. Update the Lit Action URL

Open `lit-action.js` and replace the placeholder URL with your public tunnel URL:

```javascript
const URL = "https://abc123.ngrok.io/api/action"; // Your public URL
```

### 4. Host the Lit Action on IPFS

Upload `lit-action.js` to IPFS. You can use:

- **Pinata**: Upload the file and get the CID
- **Infura IPFS**: Use their API or dashboard
- **Any IPFS service**: Upload and pin the file

Make sure to get the **CID v0** format (starts with `Qm...`).

### 5. Update the CID in common.ts

Open `common.ts` and replace the placeholder CID with your IPFS CID:

```typescript
contractAddress: "ipfs://QmeyXBhrg1mR.....6B", // Your IPFS CID v0
```

## Usage

### Encrypting Data

To encrypt data, run:

```bash
bun run encrypt
```

This will:

- Connect to the Lit network
- Encrypt the string defined in `encrypt.ts` (currently `"Je t'aime IKRAM!"`)
- Save the encrypted data to `encrypted.json`

You can modify the data to encrypt by editing the `dataToEncrypt` field in `encrypt.ts`.

### Decrypting Data

To decrypt data, run:

```bash
bun run decrypt
```

This will:

- Connect to the Lit network
- Create a SIWE (Sign-In With Ethereum) message with dynamic parameters
- Request decryption from Lit Protocol
- Print the decrypted message

## Understanding Dynamic Parameters

### The Resources Field in SIWE Message

The `resources` field in the SIWE message allows you to send dynamic function parameters to your Lit Action. The format must be:

```
litParam:variableName:base64urlEncodedValue
```

In `decrypt.ts`, you can see an example:

```typescript
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
```

These parameters are:

1. Extracted from the SIWE message by Lit Protocol
2. Passed to your Lit Action's `go` function as arguments `a` and `b`
3. Sent to your server endpoint for validation

### How It Works

1. When you call `decrypt`, the SIWE message includes parameters in the `resources` field
2. Lit Protocol extracts these parameters and calls your Lit Action's `go` function with them
3. The Lit Action makes a POST request to your server with the parameters
4. Your server validates the parameters and returns `"true"` or `"false"`
5. If the server returns `"true"`, Lit Protocol allows decryption

### Experimenting with the Endpoint

You can modify the server endpoint in `server.ts` to see how different parameter values affect decryption:

```typescript
if (body.a === "a" && body.b === "b") {
  return new Response(
    JSON.stringify({ message: "Action processed", data: "true" })
    // ...
  );
}
```

Try changing:

- The values in the `resources` array in `decrypt.ts`
- The validation logic in `server.ts`
- The endpoint URL or path

This will help you understand how the dynamic parameters flow through the system and control access to decryption.

## Project Structure

- `encrypt.ts` - Script to encrypt data using Lit Protocol
- `decrypt.ts` - Script to decrypt data with dynamic parameters
- `server.ts` - HTTP server that validates parameters from Lit Actions
- `lit-action.js` - Lit Action that calls your server endpoint
- `common.ts` - Shared configuration (access control conditions, Lit client, private key)
- `encrypted.json` - Output file containing encrypted data

## Security Notes

⚠️ **Important**: The private key in `common.ts` is for demonstration purposes only. In production:

- Never commit private keys to version control
- Use environment variables or secure key management
- Use proper access control conditions for your use case
- Secure your server endpoint with authentication if needed

## Troubleshooting

- **Connection issues**: Make sure your tunnel is active and the URL in `lit-action.js` is correct
- **CID not working**: Ensure you're using CID v0 format and the file is properly pinned on IPFS
- **Decryption fails**: Check that your server is running and the parameters match what the server expects
- **Network errors**: Verify you're connected to the correct Lit network (`datil-dev` in this example)
