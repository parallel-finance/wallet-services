import { rpc, types, typesBundle } from '@parallel-finance/type-definitions';
import { RpcService } from './RpcService';
import {
  PolkadotAccountTokenData,
  TransactionHistoryResult,
  TransactionStatusResult,
  Transfer
} from './models';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BN, bnMax } from '@polkadot/util';

import { Asset, AssetType, Balances, Chain } from '../assets/models';
import { getSubscanClient, SUBSCAN_EXTRINSIC, SUBSCAN_TRANSFERS } from './subscan';
export class PolkadotRpcService implements RpcService {
  public api: ApiPromise;

  private constructor(apiClient: ApiPromise) {
    this.api = apiClient;
  }

  public static async init(baseUrl: string) {
    const provider = new WsProvider(baseUrl, 30000);
    const api = await ApiPromise.create({ provider: provider, types, typesBundle, rpc });
    return new PolkadotRpcService(api);
  }

  async broadcastTransaction(_signedTxHex: string): Promise<string> {
    return Promise.resolve('');
  }

  async fetchAccountBalance(address: string, _assetSymbol?: string): Promise<Balances | null> {
    try {
      const [balances, stakingInfo, democracyLocks, votingOf] = await Promise.all([
        this.api.derive.balances?.all(address),
        this.api.derive.staking?.account(address),
        this.api.derive.democracy?.locks(address),
        this.api.query?.democracy?.votingOf(address)
      ]);

      let democracy = '0';
      if (democracyLocks && democracyLocks.length > 0) {
        democracy = `${bnMax(...democracyLocks.map(({ balance }) => balance))}`;
      } else if (votingOf && (votingOf as any).isDirect) {
        const {
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          prior: [_, balance]
        } = (votingOf as any).asDirect;
        democracy = `${balance}`;
      }

      const unbonding =
        stakingInfo?.unlocking
          ?.reduce((total, { value }) => total.iadd(value), new BN(0))
          .toString() || '0';
      const bonded = stakingInfo?.stakingLedger?.active?.unwrap
        ? `${stakingInfo?.stakingLedger.active?.unwrap()}`
        : '0';

      const returnableBalances = {
        total: `${balances.freeBalance.add(balances.reservedBalance)}`,
        locked: `${balances.lockedBalance}`,
        reserved: `${balances.reservedBalance}`,
        democracy: democracy,
        redeemable: stakingInfo?.redeemable ? `${stakingInfo?.redeemable}` : '0',
        bonded,
        transferrable: `${balances.availableBalance}`,
        vested: `${balances.vestedBalance}`,
        unbonding
      };

      // console.log(`Balance ${_assetSymbol} Loaded:${address}: `, returnableBalances);
      return returnableBalances;
    } catch (e) {
      // console.log(`Error fetching coin balance: ${address} - ${_assetSymbol}`, e);
      return null;
    }
  }

  async fetchAccountAssetsBalance(address: string, tokenId?: Number): Promise<Balances | null> {
    try {
      const accountToken: any = await this.api.query.assets.account(tokenId, address);
      const accountData = accountToken.toHuman() as PolkadotAccountTokenData;
      const freeBalance = `${accountData.balance}`;
      return {
        total: freeBalance,
        transferrable: freeBalance
      };
    } catch (e) {
      // console.log(`Error fetching token balance: ${address} - ${tokenId}`, e);
      return null;
    }
  }

  async fetchTokenAccountBalance(address: string, tokenName: string): Promise<Balances | null> {
    try {
      const balance = await this.api.query.tokens.accounts(address, { Token: tokenName });

      return {
        total: `${(balance as any).free}`,
        transferrable: `${(balance as any).free}`
      };
    } catch (e) {
      console.log(`Error fetching token balance: ${address} - ${tokenName}`, e);
      return null;
    }
  }

  async latestBlockNumber(_address: string): Promise<number> {
    return Promise.resolve(0);
  }

  async loadTransactions(asset: Asset): Promise<Transfer[]> {
    // https://parallel.api.subscan.io/api/scan/transfers
    try {
      const http = getSubscanClient(asset.chain);
      const response = await http.post<TransactionHistoryResult>(SUBSCAN_TRANSFERS, {
        row: 25,
        page: 0,
        address: asset.address
      });

      if (asset.assetType === AssetType.NATIVE) {
        response.data.data.transfers = response.data.data.transfers.filter(
          transfer => transfer.module === 'balances' && transfer.asset_symbol === ''
        );
      } else {
        switch (asset.chain) {
          case Chain.KARURA:
          case Chain.ACALA: {
            response.data.data.transfers = response.data.data.transfers.filter(
              transfer => transfer.module === 'currencies' && transfer.asset_symbol === asset.symbol
            );
            break;
          }
          default: {
            response.data.data.transfers = response.data.data.transfers.filter(
              transfer => transfer.module === 'assets' && transfer.asset_symbol === asset.symbol
            );
          }
        }
      }

      return response.data.data.transfers;
    } catch (e) {
      console.log('ERROR_LOAD_TXs', e);
      return [];
    }
  }

  async fetchGenesisHash(): Promise<string> {
    return this.api.genesisHash.toHex();
  }

  async getTransactionByHash(txHash: string, chain: Chain): Promise<TransactionStatusResult> {
    const http = getSubscanClient(chain);
    const response = await http.post<any>(SUBSCAN_EXTRINSIC, {
      hash: txHash
    });

    return response.data.data;
  }
}
