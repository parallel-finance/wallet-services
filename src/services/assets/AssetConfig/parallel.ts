import { Chain, AssetType, NativeTokenSymbols } from '../models';
import { getChainAssets } from '../utils';

export const PARALLEL_ASSETS = [
  ...getChainAssets(Chain.PARALLEL),
  {
    chain: Chain.PARALLEL,
    decimals: 10,
    name: 'cDOT-6/13 Parallel',
    symbol: 'cDOT-6/13',
    assetType: AssetType.NON_NATIVE,
    tokenId: '200060013'
  },
  {
    chain: Chain.PARALLEL,
    decimals: 10,
    name: 'cDOT-7/14 Parallel',
    symbol: 'cDOT-7/14',
    assetType: AssetType.NON_NATIVE,
    tokenId: '200070014'
  },
  {
    chain: Chain.PARALLEL,
    decimals: 10,
    name: 'cDOT-8/15 Parallel',
    symbol: 'cDOT-8/15',
    assetType: AssetType.NON_NATIVE,
    tokenId: '200080015'
  },
  {
    chain: Chain.PARALLEL,
    decimals: 10,
    name: 'sDOT Parallel',
    symbol: 'sDOT',
    assetType: AssetType.NON_NATIVE,
    tokenId: '1001'
  },
  {
    chain: Chain.PARALLEL,
    decimals: 10,
    name: 'DOT on Parallel',
    symbol: NativeTokenSymbols.DOT,
    assetType: AssetType.NON_NATIVE,
    tokenId: '101'
  },
  {
    chain: Chain.PARALLEL,
    decimals: 12,
    name: 'LP-DOT/PARA Parallel',
    symbol: 'LP-DOT/PARA',
    assetType: AssetType.NON_NATIVE,
    tokenId: '6002'
  },
  {
    chain: Chain.PARALLEL,
    decimals: 12,
    name: 'LP-DOT/cDOT-6/13 Parallel',
    symbol: 'LP-DOT/cDOT-6/13',
    assetType: AssetType.NON_NATIVE,
    tokenId: '6004'
  },
  {
    chain: Chain.PARALLEL,
    decimals: 12,
    name: 'LP-DOT/cDOT-7/14 Parallel',
    symbol: 'LP-DOT/cDOT-7/14',
    assetType: AssetType.NON_NATIVE,
    tokenId: '6005'
  },
  {
    chain: Chain.PARALLEL,
    decimals: 12,
    name: 'LP-PARA/cDOT-6/13 Parallel',
    symbol: 'LP-PARA/cDOT-6/13',
    assetType: AssetType.NON_NATIVE,
    tokenId: '6006'
  }
];
