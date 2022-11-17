import { DEFAULT_COSMOS_ADDRESS_PREFIX } from './../config/cosmos';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { encodeSecp256k1Pubkey, pubkeyToAddress } from '@cosmjs/amino';
import { Keyring } from '@polkadot/keyring';
import { ASSET_ACCOUNT_TYPES } from '../services/assets/assets.configs';

export const getKeyringPair = async (
  accountType: string,
  ss58Value: number,
  phrase: string,
  addressPrefix?: string
) => {
  switch (accountType) {
    case ASSET_ACCOUNT_TYPES.SECP256K1: {
      const keyring = new Keyring({ type: 'ethereum' });
      const index = 0;
      const ethDerPath = "m/44'/60'/0'/0/" + index;
      keyring.setSS58Format(ss58Value);
      return keyring.addFromUri(`${phrase}/${ethDerPath}`);
    }
    case ASSET_ACCOUNT_TYPES.COSMOS: {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(phrase);
      const [{ pubkey }] = await wallet.getAccounts();

      const formattedAddress = pubkeyToAddress(
        encodeSecp256k1Pubkey(pubkey),
        addressPrefix || DEFAULT_COSMOS_ADDRESS_PREFIX
      );
      return {
        address: formattedAddress,
        publicKey: pubkey
      };
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
