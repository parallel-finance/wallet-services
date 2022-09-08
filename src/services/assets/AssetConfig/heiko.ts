import { AssetType, Chain, NativeTokenSymbols } from '../models';
import { getChainAssets } from '../utils';

export const HEIKO_ASSETS = [
  ...getChainAssets(Chain.HEIKO),
  {
    chain: Chain.HEIKO,
    decimals: 12,
    name: 'sKSM Heiko',
    symbol: 'sKSM',
    assetType: AssetType.NON_NATIVE,
    tokenId: '1000'
  },
  {
    chain: Chain.HEIKO,
    decimals: 12,
    name: 'LP-KSM/HKO Heiko',
    symbol: 'LP-KSM/HKO',
    assetType: AssetType.NON_NATIVE,
    tokenId: '5002'
  },
  {
    chain: Chain.HEIKO,
    decimals: 12,
    name: 'cKSM-20/27 Heiko',
    symbol: 'cKSM-20/27',
    assetType: AssetType.NON_NATIVE,
    tokenId: '100200027'
  },
  {
    chain: Chain.HEIKO,
    decimals: 12,
    name: 'KSM Heiko',
    symbol: NativeTokenSymbols.KSM,
    assetType: AssetType.NON_NATIVE,
    tokenId: '100'
  },
  {
    chain: Chain.HEIKO,
    decimals: 12,
    name: 'LP-KSM/sKSM Heiko',
    symbol: 'LP-KSM/sKSM',
    assetType: AssetType.NON_NATIVE,
    tokenId: '5003'
  },
  {
    chain: Chain.HEIKO,
    decimals: 12,
    name: 'LP-KSM/cKSM-20/27 Heiko',
    symbol: 'LP-KSM/cKSM-20/27',
    assetType: AssetType.NON_NATIVE,
    tokenId: '5004'
  },
  {
    chain: Chain.HEIKO,
    decimals: 12,
    name: 'USDT Heiko',
    symbol: 'USDT',
    assetType: AssetType.NON_NATIVE,
    tokenId: '102'
  }
];
