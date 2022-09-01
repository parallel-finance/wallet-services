import chainData from '@talismn/chaindata/chaindata.json';
import { AssetType } from './models';

export const getChainAssets = chainPrefix => {
  return (
    chainData
      .filter(chain => chainPrefix === chain.prefix)
      .map(chain => ({
        account: chain.account,
        chain: chain.prefix,
        decimals: chain.decimals,
        name: chain.name,
        symbol: chain.token,
        assetType: AssetType.NATIVE
      })) || []
  );
};
