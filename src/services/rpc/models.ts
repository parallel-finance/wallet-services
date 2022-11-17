export interface Transaction {
  date: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  nonce: string;
  to: string;
  value: string;
}
export interface PolkadotAccountData {
  nonce: number;
  consumers: number;
  providers: number;
  sufficients: number;
  data: BalanceData;
}

export interface PolkadotAccountTokenData {
  readonly balance: number;
  readonly isFrozen: boolean;
}

export interface BalanceData {
  free: number;
  reserved: number;
  miscFrozen: number;
  feeFrozen: number;
}

/* eslint-disable camelcase */

export interface FromAccountDisplay {
  address: string;
  display: string;
  judgements?: any;
  account_index: string;
  identity: boolean;
  parent?: any;
}

export interface ToAccountDisplay {
  address: string;
  display: string;
  judgements?: any;
  identity: boolean;
  parent?: any;
}

export interface Transfer {
  from: string;
  to: string;
  success: boolean;
  hash: string;
  block_num: number;
  block_timestamp: number;
  module: string;
  amount: string;
  amount_v2: string;
  fee: string;
  nonce: number;
  asset_symbol: string;
  asset_type: string;
  from_account_display: FromAccountDisplay;
  to_account_display: ToAccountDisplay;
}

export interface TransactionsData {
  count: number;
  transfers: Transfer[];
  extrinsics: Extrinsic[];
}

export interface TransactionHistoryResult {
  code: number;
  message: string;
  data: TransactionsData;
}

export interface TransactionStatusResult {
  pending: boolean;
  block_timestamp: number;
  block_num: number;
  success: boolean;
  fee: string;
}

export interface Extrinsic {
  block_timestamp: number;
  block_num: number;
  extrinsic_index: string;
  call_module_function: string;
  call_module: string;
  params: string;
  account_id: string;
  account_index: string;
  signature: string;
  nonce: number;
  extrinsic_hash: string;
  success: boolean;
  fee: string;
  from_hex: string;
  finalized: boolean;
  account_display: FromAccountDisplay;
}

export interface ExtrinsicParam {
  name: string;
  type: string;
  type_name: string;
  value: any;
}

type CosmosAmount = {
  denom: string;
  amount: string;
};

type CosmosMessage = {
  type: string;
  value: {
    amount: CosmosAmount[];
    from_address: string;
    to_address: string;
  };
};

export type CosmosTransaction = {
  block_number: number;
  block_timestamp: string;
  hash: string;
  code: number;
  gas_wanted: number;
  gas_used: number;
  gas_fee: {
    amount: CosmosAmount[];
  };
  gas_limit: number;
  messages: CosmosMessage[];
};
