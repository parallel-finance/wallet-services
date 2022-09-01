import { TransferRequest } from './models';
import { ApiPromise, WsProvider } from '@polkadot/api';
import type { Ledger } from '@polkadot/hw-ledger';
import { types, typesBundle, rpc } from '@parallel-finance/type-definitions';
import { PolkadotTransactionSigner } from './signer/PolkadotTransactionSigner';
import { Asset, Chain, Networks, NativeTokenSymbols, NetworkType } from './assets/models';
import BigNumber from 'bignumber.js';
import { statefulRpc } from './rpc/statefulRpc';
import { assetService } from './assets/AssetService';
import { getChainScanAPI } from './rpc/subscan';
import { CROSSCHAIN_NETWORK_SYMBOLS } from './assets/assets.configs';
import { crossChainSend, depositToParallel, withdrawToRelay } from './transaction/';
import { SubmittableExtrinsic } from '@polkadot/api/types';

export class TransactionService {
  public async transfer(
    transferRequest: TransferRequest,
    networkType?: NetworkType,
    chainInformation?: {
      sourceNetwork: Networks;
      targetNetwork: Networks;
    }
  ): Promise<string> {
    const {
      asset: { symbol }
    } = transferRequest;
    const { sourceNetwork, targetNetwork } = chainInformation || {};

    const { transferAsset, signer } = await this.initializeSigner(
      transferRequest,
      networkType,
      targetNetwork
    );

    const isCrossChainSendAsset =
      Object.keys(CROSSCHAIN_NETWORK_SYMBOLS).includes(symbol as NativeTokenSymbols) &&
      sourceNetwork !== targetNetwork;

    if (isCrossChainSendAsset && targetNetwork && sourceNetwork) {
      const depositToParallelChain =
        [Networks.POLKADOT, Networks.KUSAMA].includes(sourceNetwork) &&
        [Networks.PARALLEL_RELAY, Networks.HEIKO_RELAY].includes(targetNetwork);
      const withdrawToRelayChain =
        [Networks.PARALLEL, Networks.HEIKO].includes(sourceNetwork) &&
        [Networks.PARALLEL_RELAY, Networks.HEIKO_RELAY].includes(targetNetwork);

      let response: {
        tx: SubmittableExtrinsic<'promise', any> | null;
        api: ApiPromise | null;
      } | null = { tx: null, api: null };

      if (depositToParallelChain) {
        response = await depositToParallel(
          targetNetwork,
          transferRequest.amount,
          transferAsset.decimals,
          transferRequest.recipient
        );
      }

      if (withdrawToRelayChain) {
        response = await withdrawToRelay(
          sourceNetwork,
          targetNetwork,
          transferRequest.amount,
          transferRequest.recipient
        );
      }

      if (response) {
        const { tx } = response;

        await crossChainSend({
          network: sourceNetwork,
          tx,
          phrase: transferRequest.decryptedPhrase
        });
      }
      return Promise.resolve('');
    }
    const signResult = await signer.signTransferAndBroadcast(
      {
        amount: transferRequest.amount,
        fromAddress: transferAsset.address,
        toAddress: transferRequest.recipient,
        asset: transferAsset
      },
      transferRequest.decryptedPhrase || ''
    );

    const transactionHash = signResult.id;
    console.log('Transfer TxHash Result', transactionHash);

    // This transactionHash can be used later to check on the status of the transaction
    return transactionHash;
  }

  public async transferFromHw(
    ledger: Ledger,
    transferRequest: TransferRequest,
    networkType?: NetworkType
  ): Promise<string> {
    try {
      const { transferAsset, signer } = await this.initializeSigner(transferRequest, networkType);
      await signer.signTransferAndBroadcastFromHw(ledger, {
        amount: transferRequest.amount,
        fromAddress: transferAsset.address,
        toAddress: transferRequest.recipient,
        asset: transferAsset
      });
      return Promise.resolve('success');
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  public async estimateTransferFee(transferRequest: TransferRequest, networkType?: NetworkType) {
    const { signer } = await this.initializeSigner(transferRequest, networkType);
    const transferAsset = transferRequest.asset;
    const feeEstimates = await signer.estimateTransferFee(
      {
        amount: transferRequest.amount,
        fromAddress: transferAsset.address,
        toAddress: transferRequest.recipient,
        asset: transferAsset
      },
      transferRequest.decryptedPhrase
    );

    const partialFee = feeEstimates.partialFee as number;

    // Since transaction fee and estimates are always in native asset, we need to use native asset decimals
    // So we look for the corresponding native asset of the current chain
    const nativeAssetConfig = assetService.getAssetConfigForChain(transferAsset.chain);

    const finalFeeValue = new BigNumber(partialFee)
      .div(new BigNumber(10).pow(nativeAssetConfig.decimals))
      .toFixed(4);

    console.log(
      `INFO:: FEE_ESTIMATE SENDING ${transferAsset.symbol} => ${finalFeeValue} ${nativeAssetConfig.symbol}`
    );

    return Number(finalFeeValue);
  }

  /// Call this function to fetch a transaction status after it has been broadcasted
  /// transactionService.fetchTransactionStatus(hash, asset.chain)
  async fetchTransactionStatus(transactionHash: string, chain: Chain) {
    const rpc = await statefulRpc.getRpcConnection(chain);
    return await rpc.getTransactionByHash(transactionHash, chain);
  }

  private async initializeSigner(
    transferRequest: TransferRequest,
    networkType: NetworkType,
    targetNetwork?: Networks
  ) {
    const transferAsset = transferRequest.asset;

    const chain = targetNetwork ? Chain?.[targetNetwork] : transferAsset.chain;
    const chainConfig = statefulRpc.getChainConfig(chain, networkType);
    const provider = new WsProvider(chainConfig.rpcUrl);
    const api: ApiPromise = await ApiPromise.create({
      provider: provider,
      types,
      typesBundle,
      rpc
    });

    const signer = new PolkadotTransactionSigner(api);
    return { transferAsset, signer, api };
  }

  public async fetchTransactionHistory(asset: Asset, networkType: NetworkType) {
    const rpc = await statefulRpc.getAssetRpcConnection(asset, networkType);
    return rpc.loadTransactions(asset);
  }

  public getTransactionUrl(txHash: string, chain: Chain) {
    // https://polkadot.subscan.io/extrinsic/0x4628bc552c70b76e4d1d4762a02602a85d677f72305a8cefa40f38e360fbc4b2
    const baseUrl = getChainScanAPI(chain);
    const baseExplorerUrl = baseUrl.replace('.api', '');
    return `${baseExplorerUrl}/extrinsic/${txHash}`;
  }

  public openExplorerAccountUrl(asset: Asset) {
    // https://polkadot.subscan.io/account/16ZL8yLyXv3V3L3z9ofR1ovFLziyXaN1DPq4yffMAZ9czzBD
    const baseUrl = getChainScanAPI(asset.chain);
    const baseExplorerUrl = baseUrl.replace('.api', '');
    return `${baseExplorerUrl}/account/${asset.address}`;
  }
}

export const transactionService = new TransactionService();
