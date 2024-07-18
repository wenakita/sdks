# Maia DAO SDK's

A repository for many Uniswap SDK's. All SDK's can be found in `sdk/` and have more information in their individual README's.

## Development Commands

```markdown
# Clone
git clone --recurse-submodules https://github.com/Maia-DAO/sdks.git
# Install
yarn
# Build
yarn g:build
# Typecheck
yarn g:typecheck
# Lint
yarn g:lint
# Test
yarn g:test
# Run a specific package.json command for an individual SDK
yarn sdk @{sdk-name} {command}
```

## Publishing SDK's

Publishing of each SDK is done on merge to main using semantic-release and semantic-release-monorepo. PR titles / commits follow angular conventional commits with custom settings that map as follows:

```markdown
- `fix(SDK name):` will trigger a patch version
- `<type>(public):` will trigger a patch version
- `feat(SDK name):` will trigger a minor version
- `feat(breaking):` will trigger a major version for a breaking change
```

Versions will only be generated based on the changelog of the relevant SDK's folder/files.

## Supported Chains

### Root Chains
These are chains that have all core contract deployments.
- 42161: Arbitrum One
- 11155111: Ethereum Sepolia

### Branch Chains
These are chains that have branch contract deployments.
- TODO

## Documentation

<!-- TODO - [SDK Documentation](https://v2-docs.maiadao.io/protocols/SDK/introduction) -->
- [Maia DAO Ecosystem Documentation](https://v2-docs.maiadao.io/)

## License

This SDK is open-source and available under the [MIT License](./LICENSE). Feel free to use, modify, and distribute it as needed for your project.

## Contributing

If you would like to contribute to the development of this SDK, please follow our [Contributing Guidelines](../../CONTRIBUTING.md).

## Contact

If you have any questions or need assistance, you can reach out to us at our discord server: https://discord.gg/maiadao.
