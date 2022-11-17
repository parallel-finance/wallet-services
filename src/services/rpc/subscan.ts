import { Chain } from '../assets/models';
import axios from 'axios';

export const getChainScanAPI = (chain: Chain): string => {
  switch (chain) {
    case Chain.POLKADOT:
      return 'https://polkadot.api.subscan.io';
    case Chain.KUSAMA:
      return 'https://kusama.api.subscan.io';
    case Chain.PARALLEL:
      return 'https://parallel.api.subscan.io';
    case Chain.HEIKO:
      return 'https://parallel-heiko.api.subscan.io';
    case Chain.ACALA:
      return 'https://acala.api.subscan.io';
    case Chain.MOONBEAM:
      return 'https://moonbeam.api.subscan.io';
    case Chain.MOONRIVER:
      return 'https://moonriver.api.subscan.io';
    case Chain.KARURA:
      return 'https://karura.api.subscan.io';
    case Chain.ASTAR:
      return 'https://astar.api.subscan.io';
    case Chain.INJECTIVE:
      return 'https://explorer.injective.network';

    case Chain.ETH:
    case Chain.SUBSTRATE:
    default:
      throw new TypeError(`Chain not supported: ${chain}`);
  }
};

export const getSubscanClient = (chain: Chain) => {
  const baseUrl = getChainScanAPI(chain);
  return axios.create({ baseURL: baseUrl });
};

export const SUBSCAN_EXTRINSIC_LIST = '/api/scan/extrinsics';
export const SUBSCAN_EXTRINSIC = '/api/scan/extrinsic';
export const SUBSCAN_TRANSFERS = '/api/scan/transfers';
