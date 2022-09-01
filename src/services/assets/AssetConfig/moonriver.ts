import { Chain } from '../models';
import { getChainAssets } from '../utils';

export const MOONRIVER_ASSETS = [...getChainAssets(Chain.MOONRIVER)];
