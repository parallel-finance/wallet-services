import { Asset } from '../assets/models';
import type { HexString } from '@polkadot/util/types';

export interface TransferTransactionUnsigned {
  asset?: Asset;
  fromAddress: string;
  toAddress: string;
  amount: string;
}

export interface ResponseSigning {
  id: string;
  signature: HexString;
}
