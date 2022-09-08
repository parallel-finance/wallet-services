/* eslint-disable camelcase */
export type PricingResponseType = {
  assetId: number;
  symbol: string;
  price: string;
  network: string;
};

export interface OraclePricingResponseUnitInterface {
  code: number;
  msg: string;
  data: Array<PricingResponseType>;
}

export type AssetResponseType = {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  isFrozen: string;
  deposit: string;
};

export interface OracleAssetResponseUnitInterface {
  code: number;
  msg: string;
  data: Array<PricingResponseType>;
}
