import { Wallet } from '../models';
import { Asset } from '../assets/models';

export interface WalletCreationResult {
  wallet: Wallet;
  assets: Asset[];
  mnemonicPhrase: string;
}
