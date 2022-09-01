export interface EncryptedSeed {
  walletId: string;
  data: EncryptionResult;
}

export interface WalletEncrypted {
  walletId: string;
  encryption: EncryptionResult;
}

export interface HashResult {
  data: string;
  salt: string;
}

// Hashed credential
export interface EncryptedCredential extends HashResult {}

export interface EncryptionResult {
  cipher: string;
  iv: InitialVector;
}

export interface InitialVector {
  words: number[];
  sigBytes: number;
}
