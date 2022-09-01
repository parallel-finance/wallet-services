import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import BigNumber from 'bignumber.js';
import { isAddress } from 'web3-utils';
import { ASSET_ACCOUNT_TYPES } from '../services/assets/assets.configs';
import { Chain, Networks } from '../services/assets/models';


export const sleep = ms =>
  new Promise(resolve => {
    return setTimeout(resolve, ms);
  });

const formatter = (maximumFractionDigits = 2) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits
  });

export const formatDollars = (num: number) => {
  const decimalsNeeded = num !== 0 ? 2 : 0;
  return formatter(decimalsNeeded).format(num);
};

export const formatTokenAmount = (num: string) => {
  return new BigNumber(num)
    .decimalPlaces(4)
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

export const massageBalancesFromRPC = (num: string, assetDecimals: number): string => {
  // Some balances are returned with comma separated values, confusing BigNumber conversion
  const parsedBalance = (num || '0').replace(/,/g, '');

  // The balance returned from the network is often on native unit 10^(decimals)
  return new BigNumber(parsedBalance).div(new BigNumber(10).pow(assetDecimals)).toFixed(4);
};


export const isValidAddress = (address: string, accountType: string) => {
  switch (accountType) {
    case ASSET_ACCOUNT_TYPES.SECP256K1: {
      return isAddress(address);
    }
    default: {
      try {
        encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
        return true;
      } catch (error) {
        return false;
      }
    }
  }
};

export const getNetworkFromChainNumber = (chainNumber: number): Networks | null =>
  Object.keys(Chain).find(c => Chain[c] === chainNumber) as Networks | null;

