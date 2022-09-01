import { Chain, AssetType } from '../models';
import { getChainAssets } from '../utils';

export const ACALA_ASSETS = [
  ...getChainAssets(Chain.ACALA),
  {
    chain: Chain.ACALA,
    decimals: 12,
    name: 'Acala Dollar',
    symbol: 'aUSD',
    assetType: AssetType.NON_NATIVE
  },
  {
    chain: Chain.ACALA,
    decimals: 10,
    name: 'Liquid LDOT',
    symbol: 'LDOT',
    assetType: AssetType.NON_NATIVE
  }
];
