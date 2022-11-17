import { Asset, AssetType, Balances, Chain, NetworkType } from './models';
import { ASSETS_CONFIGS } from './assets.configs';
import { statefulRpc } from '../rpc/statefulRpc';
import { massageBalancesFromRPC } from '../../utils/common';
export class AssetService {
  public async fetchBalance(asset: Asset, networkType?: NetworkType): Promise<Balances> {
    const rpc = await statefulRpc.getAssetRpcConnection(asset, networkType);
    const isNativeAsset = asset.assetType === AssetType.NATIVE;

    let accountBalance;

    switch (asset.chain) {
      case Chain.KARURA:
      case Chain.ACALA: {
        accountBalance = isNativeAsset
          ? await rpc.fetchAccountBalance(asset.address, asset.symbol)
          : await rpc.fetchTokenAccountBalance(asset.address, asset.symbol);
        break;
      }
      case Chain.KUSAMA:
      case Chain.POLKADOT:
      case Chain.PARALLEL:
      case Chain.MOONBEAM:
      case Chain.ASTAR:
      case Chain.MOONRIVER:
      case Chain.INJECTIVE:
      case Chain.HEIKO: {
        // Asset tokenID is expected to be a numerical on substrate network
        accountBalance = isNativeAsset
          ? await rpc.fetchAccountBalance(asset.address, asset.symbol)
          : await rpc.fetchAccountAssetsBalance(asset.address, Number(asset.tokenId));
        break;
      }
      case Chain.ETH:
      default:
        throw TypeError(
          `${asset.symbol} asset of the ${asset.chain} not support yet ${asset.symbol}`
        );
    }
    const massagedBalances = {
      total: massageBalancesFromRPC(accountBalance?.total, asset.decimals),
      bonded: massageBalancesFromRPC(accountBalance?.bonded, asset.decimals),
      democracy: massageBalancesFromRPC(accountBalance?.democracy, asset.decimals),
      redeemable: massageBalancesFromRPC(accountBalance?.redeemable, asset.decimals),
      transferrable: massageBalancesFromRPC(accountBalance?.transferrable, asset.decimals),
      locked: massageBalancesFromRPC(accountBalance?.locked, asset.decimals),
      reserved: massageBalancesFromRPC(accountBalance?.reserved, asset.decimals),
      vested: massageBalancesFromRPC(accountBalance?.vested, asset.decimals),
      unbonding: massageBalancesFromRPC(accountBalance?.unbonding, asset.decimals)
    };
    return massagedBalances;
  }

  public async loadTransactionHistory(asset: Asset) {
    const rpc = await statefulRpc.getRpcConnection(asset?.chain);
    return await rpc.loadTransactions(asset);
  }

  public getAssetConfigForChain(chain: Chain) {
    for (const assetConfig of ASSETS_CONFIGS) {
      if (assetConfig.chain === chain && assetConfig.assetType === AssetType.NATIVE) {
        return assetConfig;
      }
    }
    return null;
  }
}

export const assetService = new AssetService();
