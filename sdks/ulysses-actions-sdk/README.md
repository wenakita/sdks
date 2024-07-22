# Alpha software

The latest version of the Ulysses Actions SDK is used in production in the Hermes Interface,
but it is considered Alpha software and may contain bugs or change significantly between patch versions.
If you have questions about how to use the SDK, please reach out through Discord.
Pull requests welcome!

# Ulysses Actions SDK

⚒️ Ulysses Actions SDK is a powerful tool that allows you to easily use with Ulysses Protocol for cross-chain contract interactions as well as asset transfers.

## Features

- Actions
- Context Handler
- Action Builder

## Installation

To install Ulysses Actions SDK, follow on of these steps:

```bash
npm install ulysses-actions-sdk
```
or

```bash
yarn add ulysses-actions-sdk
```

## Usage

Here's a basic example of how to use Ulysses Actions SDK to interact with Hermes remotely:

```typescript
import { ActionBuilder, BurnHermesAction, ContextHandler, IActionResult, IContextParameters } from 'ulysses-actions-sdk'

// Populate Context Parameters according to details such as origin chain, gas details, etc...
const contextParams: IContextParameters = {
  chainId: originChainId
  useVirtualAccount: true
  userAccount?: '0xCOFFE'
}

// Create Context
const context: ContextHandler = new ContextHandler(context)

// Create Action Builder
const builder: ActionBuilder = new ActionBuilder(context)

// Add action
builder.addAction(new BurnHermesAction({ amount: 100, recipinet: '0xBABE' }))

// Build calldata
const result: IActionResult = builder.build()
```

## Pre-commit hook

We use Husky to run pre-commit hooks. The configuration file is located in `lint-staged.js`. If you wish to run a commit without running these commit hooks, simply add `--no-verify` at the end of your commit command.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](../../CONTRIBUTING.md) for more details.

## License

Ulysses Actions SDK is [MIT licensed](./LICENSE).

## Contact

If you have any questions or issues, please [contact us](https://discord.com/invite/MaiaDAO).
