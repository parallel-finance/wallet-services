import { StargateClient } from '@cosmjs/stargate';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { Asset, Balances } from '../assets/models';
import { CosmosTransaction, Transfer } from './models';
import { RpcService } from './RpcService';
export class CosmosRpcService implements RpcService {
  public client: StargateClient;

  private constructor(client: StargateClient) {
    this.client = client;
  }

  public static async init(baseUrl: string) {
    const client = await StargateClient.connect(baseUrl);
    return new CosmosRpcService(client);
  }

  async fetchAccountBalance(address: string, assetSymbol?: string): Promise<Balances | null> {
    try {
      if (assetSymbol) {
        const coin = await this.client.getBalance(address, 'uosmo');
        return {
          total: coin.amount,
          transferrable: coin.amount
        };
      }
      return null;
    } catch (e) {
      console.error('fetch account balance error:', e);
      return null;
    }
  }

  async fetchTokenAccountBalance(
    _address: string,
    _assetSymbol?: string
  ): Promise<Balances | null> {
    return Promise.resolve(null);
  }

  async fetchAccountAssetsBalance(_address: string, _tokenId?: Number): Promise<Balances | null> {
    return Promise.resolve(null);
  }

  async broadcastTransaction(_signedTxHex: string): Promise<string> {
    return Promise.resolve('');
  }

  async latestBlockNumber(_address: string): Promise<number> {
    return Promise.resolve(0);
  }

  async loadTransactions(asset: Asset): Promise<Transfer[]> {
    // https://k8s.testnet.exchange.grpc-web.injective.network/api/explorer/v1/accountTxs/inj1phd706jqzd9wznkk5hgsfkrc8jqxv0kmlj0kex?type=cosmos.bank.v1beta1.MsgSend&limit=5
    try {
      const http = axios.create({
        baseURL: 'https://k8s.testnet.exchange.grpc-web.injective.network'
      });
      // TODO replace the hardCode asset address using `asset.address`
      const response = await http.get<{ data: CosmosTransaction[] }>(
        `/api/explorer/v1/accountTxs/${'inj1phd706jqzd9wznkk5hgsfkrc8jqxv0kmlj0kex'}?type=cosmos.bank.v1beta1.MsgSend&limit=25`
      );

      const transactions = response.data.data;

      const result = transactions.reduce((sum, transaction) => {
        const {
          hash,
          block_number: blockNumber,
          block_timestamp: blockTimestamp,
          code
        } = transaction;

        const filteredTxs = transaction.messages
          // filter the messages that don't include the asset.symbol
          .filter(message =>
            message.value.amount.find(amount => amount.denom === asset.symbol.toLowerCase())
          )
          .map(message => {
            const totalAmount = message.value.amount
              .filter(amount => amount.denom === asset.symbol.toLowerCase())
              .reduce(
                (total: BigNumber, amount) => total.plus(amount.amount).div(10 ** 18), // TODO replace the 18 with asset.decimals
                new BigNumber(0)
              );
            return {
              from: message.value.from_address,
              to: message.value.to_address,
              success: code === 0,
              hash,
              block_num: blockNumber,
              block_timestamp: new Date(blockTimestamp).getTime() / 1000,
              amount: totalAmount.toString(),
              amount_v2: '0',
              module: 'balances',
              fee: 0,
              nonce: 0,
              asset_symbol: asset.symbol,
              asset_type: 'native',
              from_account_display: {},
              to_account_display: {}
            };
          });
        return [...sum, ...filteredTxs];
      }, []);
      return result;
    } catch (e) {
      console.log('ERROR_LOAD_TXs', e);
      return [];
    }
  }
}
