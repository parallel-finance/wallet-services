import { Keyring } from '@polkadot/keyring';
import { ASSET_ACCOUNT_TYPES } from '../services/assets/assets.configs';

export const getKeyringPair = (accountType: string, ss58Value: number, phrase: string) => {
  switch (accountType) {
    case ASSET_ACCOUNT_TYPES.SECP256K1: {
      const keyring = new Keyring({ type: 'ethereum' });
      const index = 0;
      const ethDerPath = "m/44'/60'/0'/0/" + index;
      keyring.setSS58Format(ss58Value);
      return keyring.addFromUri(`${phrase}/${ethDerPath}`);
    }
    default: {
      const keyring = new Keyring({ type: 'sr25519' });
      keyring.setSS58Format(ss58Value);
      return keyring.addFromMnemonic(phrase);
    }
  }
};

export const getLockedKeyringPair = (ss58Value: number, address: string) => {
  const keyring = new Keyring({ type: 'sr25519' });
  keyring.setSS58Format(ss58Value);
  return keyring.addFromAddress(address);
};
