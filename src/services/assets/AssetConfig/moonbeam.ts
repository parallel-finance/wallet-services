import { Chain } from '../models';
import { getChainAssets } from '../utils';

export const MOONBEAM_ASSETS = [...getChainAssets(Chain.MOONBEAM)];
