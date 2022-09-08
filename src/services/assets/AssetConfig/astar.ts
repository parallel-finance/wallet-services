import { Chain } from '../models';
import { getChainAssets } from '../utils';

// Don't support SDN yet
export const ASTAR_ASSETS = [...getChainAssets(Chain.ASTAR)].filter(
  asset => asset.symbol !== 'SDN'
);
