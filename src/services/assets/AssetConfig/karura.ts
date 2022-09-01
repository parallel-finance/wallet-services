import { Chain, AssetType } from '../models';
import { getChainAssets } from '../utils';

export const KARURA_ASSETS = [
  ...getChainAssets(Chain.KARURA),
  {
    chain: Chain.KARURA,
    decimals: 12,
    name: 'Liquid KSM',
    symbol: 'LKSM',
    assetType: AssetType.NON_NATIVE
  }
];
