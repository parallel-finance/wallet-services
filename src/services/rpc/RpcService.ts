import { Transfer } from './models';
import { Asset, Balances } from '../assets/models';

export interface RpcService {
  fetchAccountBalance(address: string, assetSymbol?: string): Promise<Balances | null>;

  fetchTokenAccountBalance(address: string, assetSymbol?: string): Promise<Balances | null>;

  fetchAccountAssetsBalance(address: string, _tokenId?: Number): Promise<Balances | null>;

  broadcastTransaction(signedTxHex: string): Promise<string>;

  latestBlockNumber(address: string): Promise<number>;

  loadTransactions(asset: Asset): Promise<Transfer[]>;
}
