// Slip44 Chain values: https://github.com/satoshilabs/slips/blob/master/slip-0044.md
// Note that "Address Prefixes" values are used for Substrate Chains
export enum Chain {
  // eslint-disable-next-line no-unused-vars
  ETH = 60,
  // eslint-disable-next-line no-unused-vars
  POLKADOT = 0,
  // eslint-disable-next-line no-unused-vars
  KUSAMA = 2,
  // eslint-disable-next-line no-unused-vars
  PARALLEL = 172,
  // eslint-disable-next-line no-unused-vars
  HEIKO = 110,
  // eslint-disable-next-line no-unused-vars
  ACALA = 10,
  // eslint-disable-next-line no-unused-vars
  MOONBEAM = 1284,
  MOONRIVER = 1285,
  KARURA = 8,
  ASTAR = 5,

  // eslint-disable-next-line no-unused-vars
  SUBSTRATE = 42,

  // relay chains
  PARALLEL_RELAY = 2012,
  HEIKO_RELAY = 2085,
  INJECTIVE = 123 // TODO what means of the number value?
}

export enum Networks {
  ETH = 'ETH',
  POLKADOT = 'POLKADOT',
  KUSAMA = 'KUSAMA',

  PARALLEL_RELAY = 'PARALLEL_RELAY',
  HEIKO_RELAY = 'HEIKO_RELAY',

  PARALLEL = 'PARALLEL',
  HEIKO = 'HEIKO',
  ACALA = 'ACALA',
  MOONBEAM = 'MOONBEAM',
  MOONRIVER = 'MOONRIVER',
  KARURA = 'KARURA',
  ASTAR = 'ASTAR',

  SUBSTRATE = 'SUBSTRATE',
  INJECTIVE = 'INJECTIVE'
}

export const LedgerNetworksDerivableMap = {
  [Networks.POLKADOT]: [Networks.POLKADOT, Networks.PARALLEL],
  [Networks.KUSAMA]: [Networks.KUSAMA, Networks.HEIKO],
  [Networks.PARALLEL]: [Networks.POLKADOT, Networks.PARALLEL],
  [Networks.ACALA]: [Networks.ACALA],
  [Networks.MOONBEAM]: [Networks.MOONBEAM],
  [Networks.MOONRIVER]: [Networks.MOONRIVER],
  [Networks.KARURA]: [Networks.KARURA],
  [Networks.ASTAR]: [Networks.ASTAR]
};

export enum NativeTokenSymbols {
  DOT = 'DOT',
  PARA = 'PARA',
  KSM = 'KSM',
  HKO = 'HKO',
  ACA = 'ACA',
  GLMR = 'GLMR',
  MOVR = 'MOVR',
  KAR = 'KAR',
  ASTR = 'ASTR',
  INJ = 'INJ'
}

export interface ChainConfig {
  rpcUrl: string;
  chainId: string;
  chain: Chain;
  addressPrefix?: string;
}

export enum NetworkType {
  // eslint-disable-next-line no-unused-vars
  MAINNET,
  // eslint-disable-next-line no-unused-vars
  TESTNET
}

export enum AssetType {
  // eslint-disable-next-line no-unused-vars
  NATIVE,
  // eslint-disable-next-line no-unused-vars
  NON_NATIVE
}

export interface AssetConfig {
  symbol: string;
  name: string;
  decimals: number;
  chain: Chain;
  assetType: AssetType;
  tokenId?: string;
  account?: string;
}

export interface Balances {
  total: string;
  reserved?: string;
  locked?: string;
  democracy?: string;
  redeemable?: string;
  bonded?: string;
  transferrable?: string;
  vested?: string;
  unbonding?: string;
}

export interface Asset extends AssetConfig {
  assetId: string;
  walletId: string;

  iconUrl: string;

  address: string;
  addressPrefix?: string;
  publicKey?: string;

  balances: Balances | null;
  accountType: string;
}
