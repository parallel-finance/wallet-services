import { Keyring } from '@polkadot/api';
import { Chain } from '../assets/models';

export { depositToParallel } from './xcm/deposit-to-parallel';
export { withdrawToRelay } from './xcm/withdraw-to-relay';

export const crossChainSend = async ({ network, tx, phrase }) => {
  try {
    const keyring = new Keyring({ type: 'sr25519' });
    const ss58Value = parseInt(Chain[network]);

    keyring.setSS58Format(ss58Value);
    const signingKey = keyring.addFromMnemonic(phrase);

    const signedTxResult = await tx.signAndSend(signingKey);

    console.log('Broadcast Tx Result is : ', signedTxResult.toHex());

    return signedTxResult;
  } catch (err) {
    console.error('[TRANSFER] Cross chain sending failed', err);
  }
};
