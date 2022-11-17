/// In this file we define substrate assets configuration

import { AssetConfig, Chain, NativeTokenSymbols, Networks } from './models';
import {
  ACALA_ASSETS,
  ASTAR_ASSETS,
  HEIKO_ASSETS,
  INJECTIVE_ASSETS,
  KARURA_ASSETS,
  KUSAMA_ASSETS,
  MOONBEAM_ASSETS,
  MOONRIVER_ASSETS,
  PARALLEL_ASSETS,
  POLKADOT_ASSETS
} from './AssetConfig';

export const ASSETS_CONFIGS: AssetConfig[] = [
  ...PARALLEL_ASSETS,
  ...HEIKO_ASSETS,
  ...POLKADOT_ASSETS,
  ...KUSAMA_ASSETS,
  ...ACALA_ASSETS,
  ...MOONBEAM_ASSETS,
  ...MOONRIVER_ASSETS,
  ...KARURA_ASSETS,
  ...ASTAR_ASSETS,
  ...INJECTIVE_ASSETS
];

export const NATIVE_TOKENS = {
  [Networks.POLKADOT]: NativeTokenSymbols.DOT,
  [Networks.PARALLEL_RELAY]: NativeTokenSymbols.DOT,
  [Networks.KUSAMA]: NativeTokenSymbols.KSM,
  [Networks.HEIKO_RELAY]: NativeTokenSymbols.KSM,
  [Networks.PARALLEL]: NativeTokenSymbols.PARA,
  [Networks.HEIKO]: NativeTokenSymbols.HKO,
  [Networks.ACALA]: NativeTokenSymbols.ACA,
  [Networks.MOONBEAM]: NativeTokenSymbols.GLMR,
  [Networks.MOONRIVER]: NativeTokenSymbols.MOVR,
  [Networks.KARURA]: NativeTokenSymbols.KAR,
  [Networks.ASTAR]: NativeTokenSymbols.ASTR,
  [Networks.INJECTIVE]: NativeTokenSymbols.INJ
};

export const CROSSCHAIN_NETWORK_SYMBOLS = {
  [NativeTokenSymbols.DOT]: [Networks.PARALLEL_RELAY],
  [NativeTokenSymbols.KSM]: [Networks.HEIKO_RELAY]
};

export const EXISTENTIAL_VALUES: Record<number, Record<string, number>> = {
  [Chain.PARALLEL]: {
    PARA: 0.1
  },
  [Chain.HEIKO]: {
    HKO: 0.01
  },
  [Chain.KUSAMA]: {
    KSM: 0.0000333333
  },
  [Chain.POLKADOT]: {
    DOT: 1
  },
  [Chain.ACALA]: {
    ACA: 0.1,
    aUSD: 0.1,
    LDOT: 0.05
  },
  [Chain.KARURA]: {
    KAR: 0.1,
    LKSM: 0.0005
  },
  [Chain.ASTAR]: {
    ASTR: 0.000000000001
  }
};

export const MAX_TX_FEES: Record<NativeTokenSymbols, number> = {
  [NativeTokenSymbols.PARA]: 0.5,
  [NativeTokenSymbols.KSM]: 0.0002,
  [NativeTokenSymbols.DOT]: 0.05,
  [NativeTokenSymbols.HKO]: 0.5,
  [NativeTokenSymbols.ACA]: 0.0025,
  [NativeTokenSymbols.GLMR]: 0.0005,
  [NativeTokenSymbols.MOVR]: 0.0005,
  [NativeTokenSymbols.KAR]: 0.005,
  [NativeTokenSymbols.ASTR]: 0.002,
  [NativeTokenSymbols.INJ]: 0.0002 // TODO this is the max BRIDGE_FEE
};

export const ASSET_ACCOUNT_TYPES = {
  SECP256K1: 'secp256k1',
  SR25519: 'sr25519',
  COSMOS: 'cosmos'
};
