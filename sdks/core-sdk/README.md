# Maia DAO Ecosystem Core SDK

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/maia-core-sdk/latest.svg)](https://www.npmjs.com/package/maia-core-sdk/v/latest)

The Maia DAO Ecosystem TypeScript SDK is a library that provides TypeScript typings for interacting with the Maia DAO ecosystem's smart contracts and addresses.

This code is shared across Maia DAO Ecosystem TypeScript SDKs.

## Features

- TypeScript typings for Maia DAO smart contracts.
- Addresses for Maia DAO contracts on various blockchains.

## Installation

You can install the Maia DAO Ecosystem TypeScript SDK using npm or yarn:

```sh
npm install maia-core-sdk
# or
yarn add maia-core-sdk

## Usage

Here's a basic example of how to use the SDK to interact with Maia DAO contracts:

```ts
import { HermesAddresses} from 'maia-core-sdk';

const bHermesGaugesAddress = HermesAddresses.bHermesGauges;

// Use the address to interact with the contract
```

<!-- TODO For more detailed documentation and examples, please refer to the [SDK Documentation](https://v2-docs.maiadao.io/protocols/SDK/introduction). -->
