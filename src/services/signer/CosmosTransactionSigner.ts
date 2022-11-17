import { DEFAULT_GAS_PRICE } from './../../config/cosmos';
import { coins, DirectSecp256k1HdWallet, EncodeObject } from '@cosmjs/proto-signing';
import { calculateFee, GasPrice, SigningStargateClient } from '@cosmjs/stargate';

import { ResponseSigning, TransferTransactionUnsigned } from './models';
import { BigNumber } from 'bignumber.js';
import { Ledger } from '@polkadot/hw-ledger';

export class CosmosTransactionSigner {
  public rpc: string;

  public constructor(rpcUrl: string) {
    this.rpc = rpcUrl;
  }

  async estimateTransferFee(transaction: TransferTransactionUnsigned, phrase: string) {
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(phrase, {
      prefix: 'osmo' // TODO replace the 'osmo' to `transaction.asset.symbol`
    });
    const senderAddress = (await signer.getAccounts())[0].address;

    const signingClient = await SigningStargateClient.connectWithSigner(this.rpc, signer);

    const sendMsg: EncodeObject = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        fromAddress: senderAddress,
        toAddress: transaction.toAddress,
        amount: coins(transaction.amount, 'uosmo') // TODO replace the 'osmo' to `transaction.asset.symbol`
      }
    };
    const fee = await signingClient.simulate(senderAddress, [sendMsg], '');
    return {
      partialFee: calculateFee(fee, GasPrice.fromString(`${DEFAULT_GAS_PRICE}${'uosmo'}`)).amount[0]
        .amount
    };
  }

  public async signTransferAndBroadcastFromHw(
    _ledger: Ledger,
    _transaction: TransferTransactionUnsigned
  ): Promise<string> {
    return Promise.reject(new Error('dont support'));
  }

  public async signTransferAndBroadcast(
    transaction: TransferTransactionUnsigned,
    phrase: string
  ): Promise<ResponseSigning> {
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(phrase, {
      prefix: 'osmo'
    });
    const senderAddress = (await signer.getAccounts())[0].address;
    const asset = transaction.asset;
    const signingClient = await SigningStargateClient.connectWithSigner(this.rpc, signer, {
      gasPrice: GasPrice.fromString(`${DEFAULT_GAS_PRICE}${'uosmo'}`)
    });
    const amount = new BigNumber(transaction.amount)
      .times(new BigNumber(10).pow(transaction.asset.decimals))
      .toFixed();

    console.log('transaction amount', { denom: asset.symbol, amount: amount });
    const result = await signingClient.sendTokens(
      senderAddress,
      transaction.toAddress,
      [{ denom: 'uosmo', amount: amount }], // TODO replace the uosmo
      'auto'
    );
    return {
      id: result.transactionHash,
      signature: '0x'
    };
  }
}
