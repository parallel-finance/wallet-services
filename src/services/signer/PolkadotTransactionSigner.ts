import { ResponseSigning, TransferTransactionUnsigned } from './models';
import { ApiPromise, WsProvider } from '@polkadot/api';
import type { Ledger } from '@polkadot/hw-ledger';
import BigNumber from 'bignumber.js';
import { rpc, types, typesBundle } from '@parallel-finance/type-definitions';
import LedgerSigner from './LedgerSigner';
import { AssetType, Chain } from '../assets/models';
import { getKeyringPair, getLockedKeyringPair } from '../../utils/crypto';

export class PolkadotTransactionSigner {
  public api: ApiPromise;

  public constructor(rpcUrl: string) {
    this.init(rpcUrl);
  }

  private async init(rpcUrl) {
    const provider = new WsProvider(rpcUrl);
    const api: ApiPromise = await ApiPromise.create({
      provider: provider,
      types,
      typesBundle,
      rpc
    });
    this.api = api;
  }

  // First successful transaction: https://westend.subscan.io/extrinsic/10600841-2
  public async signTransferAndBroadcast(
    transaction: TransferTransactionUnsigned,
    phrase: string
  ): Promise<ResponseSigning> {
    const { signingKey, transferTx } = await this.prepareTxData(transaction, phrase);

    const signedTxResult = await transferTx.signAndSend(signingKey);

    console.log('Broadcast Tx Result', signedTxResult);
    console.log('\nResult is : ', signedTxResult.toHex());

    return {
      signature: '0x',
      id: signedTxResult.toHex()
    };
  }

  public async signTransferAndBroadcastFromHw(
    ledger: Ledger,
    transaction: TransferTransactionUnsigned
  ): Promise<string> {
    try {
      const { transferTx } = await this.prepareTxData(transaction, '');
      await transferTx.signAsync(transaction.fromAddress, {
        nonce: -1,
        signer: new LedgerSigner(transferTx.registry, ledger, 0, 0)
      });
      const unsubscribe = await transferTx.send(signedTxResult => {
        if (signedTxResult.status.isFinalized || signedTxResult.status.isInBlock) {
          signedTxResult.events
            .filter(({ event: { section } }) => section === 'system')
            .forEach(({ event: { method } }): void => {
              if (method === 'ExtrinsicFailed') {
                console.error('Extrinsic failed');
              } else if (method === 'ExtrinsicSuccess') {
                console.log('Extrinsic success');
              }
            });
        } else if (signedTxResult.isError) {
          console.error('error');
        }
        if (signedTxResult.isCompleted) {
          unsubscribe();
        }
      });
      return Promise.resolve('success');
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  async estimateTransferFee(transaction: TransferTransactionUnsigned, phrase: string) {
    try {
      const { signingKey, transferTx } = await this.prepareTxData(transaction, phrase);
      const paymentInfo = await transferTx.paymentInfo(signingKey);
      return paymentInfo.toJSON();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async prepareTxData(transaction: TransferTransactionUnsigned, phrase: string) {
    const asset = transaction.asset;
    const ss58Value = asset?.chain?.valueOf();
    const signingKey = phrase
      ? await getKeyringPair(asset.accountType, ss58Value, phrase)
      : getLockedKeyringPair(ss58Value, transaction.fromAddress);

    const amount = new BigNumber(transaction.amount)
      .times(new BigNumber(10).pow(asset.decimals))
      .toFixed();

    console.log('Transfer FromAddress:', signingKey.address);
    console.log('Transfer ToAddress:', transaction.toAddress);
    console.log('Transfer transfer amount: 10^18:', amount);

    if (transaction.asset.assetType === AssetType.NATIVE) {
      // Native tokens
      const transferTx = this.api.tx.balances.transfer(transaction.toAddress, amount);
      return { signingKey, transferTx };
    }
    // Derived tokens
    let transferTx;
    switch (transaction.asset.chain) {
      case Chain.KARURA:
      case Chain.ACALA: {
        transferTx = this.api.tx.currencies.transfer(
          transaction.toAddress,
          { Token: transaction.asset.symbol.toUpperCase() },
          amount
        );
        break;
      }
      default: {
        transferTx = this.api.tx.assets.transfer(
          transaction.asset.tokenId,
          transaction.toAddress,
          amount
        );
      }
    }

    return { signingKey, transferTx };
  }
}
