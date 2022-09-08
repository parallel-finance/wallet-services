import { cryptoWaitReady } from '@polkadot/util-crypto';

export * from './services/models';
export * from './services/assets/models';

export * from './services/TransactionService';
export * from './services/credential/CredentialService';
export * from './services/cryptography/Encryptor';
export * from './services/assets/assets.configs';
export * from './services/signer/CustomTypesSigner';
export * from './services/wallet/WalletCreator';
export * from './services/wallet/models';
export * from './services/WalletService';
export * from './services/cryptography/models';
export * from './services/assets/AssetService';
export * from './services/pricing/';
export * from './services/signer/CustomSignId';

// sr25519 Keypair derivation has only a WASM interface, so it needs to be loaded
// We only need to do this once per app, somewhere in our init code
// https://polkadot.js.org/docs/keyring/start/create
export const initWalletServices = async (): Promise<null> => {
  await cryptoWaitReady();
  return null;
};
