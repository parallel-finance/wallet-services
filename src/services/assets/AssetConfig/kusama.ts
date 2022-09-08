import { Chain } from '../models';
import { getChainAssets } from '../utils';

export const KUSAMA_ASSETS = [...getChainAssets(Chain.KUSAMA)];
