import { Chain } from '../models';
import { getChainAssets } from '../utils';

export const POLKADOT_ASSETS = [...getChainAssets(Chain.POLKADOT)];
