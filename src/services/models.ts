import { InitialVector } from './cryptography/models';
import { Asset, Networks } from './assets/models';
import type { KeypairType } from '@polkadot/util-crypto/types';
import { Transfer } from './rpc/models';

export enum WalletSource {
  WEB = 'WEB',
  HARDWARE = 'HARDWARE'
}
export interface Wallet {
  walletId: string;
  derivationIndex: number; // The path at which the account was derived at
  name: string;
  encryptedPhrase: string;
  config: WalletConfig;

  // Injected values
  address?: string;
  genesisHash?: string;
  defaultNetwork?: Networks;
  source: WalletSource;
  type?: KeypairType;
  ledgerImportedNetworks?: Networks[];
}

export interface WalletWithAssets {
  wallet: Wallet;
  assets: Asset[];
}

export interface WalletInitialize extends Wallet {
  mnemonicPhrase: string;
}

// Wallet level configurations will be added here
export interface WalletConfig {
  enabled: boolean;
  iv: InitialVector;
}

export interface TransferRequest {
  wallet: Wallet;
  asset: Asset;
  amount: string;
  recipient: string;
  // This will be obtained by asking the user for the password and then decrypting the persisted encrypted phrase of the current wallet
  // Then the decryptedPhrase will be passed in the transfer request, this will be used to sign the transaction
  decryptedPhrase?: string;
}

export interface TransferTransaction extends Transfer {}
