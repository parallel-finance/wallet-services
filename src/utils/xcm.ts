import { decodeAddress } from '@polkadot/keyring';
import { BN, u8aToHex } from '@polkadot/util';
import { BigNumber } from 'bignumber.js';

export const addressToHex = (address: string) => u8aToHex(decodeAddress(address));

/**
 * @deprecated Use amountToBalanceByDecimals instead of mulDecs, and will do a cleanup in the near future.
 */
export const mulDecs = (amount: number, decimals: BN): number => {
  const decsNum = parseInt(decimals.toString(), 10);
  const base = new BigNumber(10).pow(decsNum);
  return Number.parseFloat(
    new BigNumber(amount).multipliedBy(base).toFixed(0, BigNumber.ROUND_DOWN)
  );
};
