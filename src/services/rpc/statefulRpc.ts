import { Asset, Chain, ChainConfig, NetworkType } from '../assets/models';
import { PolkadotRpcService } from './PolkadotRpcService';

class StatefulRPC {
  rpcApiConnections = new Map();

  public getChainConfig(chain: Chain, networkType?: NetworkType): ChainConfig {
    const network = networkType || NetworkType.MAINNET;
    const chainId = `${chain.valueOf()}`;
    switch (network) {
      case NetworkType.MAINNET:
        switch (chain) {
          case Chain.PARALLEL:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://rpc.parallel.fi'
            };
          case Chain.HEIKO:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://heiko-rpc.parallel.fi'
            };
          case Chain.PARALLEL_RELAY:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://polkadot-rpc.parallel.fi'
            };
          case Chain.HEIKO_RELAY:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://kusama-rpc.parallel.fi'
            };
          case Chain.ETH:
            break;
          case Chain.POLKADOT:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://rpc.polkadot.io'
            };
          case Chain.KUSAMA:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://kusama-rpc.polkadot.io'
            };
          case Chain.ACALA:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://acala-polkadot.api.onfinality.io/public-ws'
            };
          case Chain.MOONBEAM:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://moonbeam.api.onfinality.io/public-ws'
            };
          case Chain.MOONRIVER:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://moonriver.api.onfinality.io/public-ws'
            };
          case Chain.KARURA:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://karura.api.onfinality.io/public-ws'
            };
          case Chain.ASTAR:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://astar.api.onfinality.io/public-ws'
            };
        }
        break;

      // https://www.notion.so/parallelfinance/Polkadot-3e8cdb70b3504623b83ba4dbfa8fbd8b
      case NetworkType.TESTNET:
        switch (chain) {
          case Chain.PARALLEL:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://regnet2-rpc.parallel.fi'
            };
          case Chain.HEIKO:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://regnet-rpc.parallel.fi'
            };
          case Chain.ETH:
            break;

          case Chain.PARALLEL_RELAY:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://regnet2-relay-rpc.parallel.fi'
            };
          case Chain.HEIKO_RELAY:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://regnet-relay-rpc.parallel.fi'
            };
          case Chain.POLKADOT:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://regnet2-relay-rpc.parallel.fi'
            };
          case Chain.KUSAMA:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://regnet-relay-rpc.parallel.fi'
            };
          case Chain.ACALA:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://acala-mandala.api.onfinality.io/public-ws'
            };
          case Chain.MOONBEAM:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://moonbeam-alpha.api.onfinality.io/public-ws'
            };
          case Chain.MOONRIVER:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://moonriver.api.onfinality.io/public-ws'
            };
          case Chain.KARURA:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://karura.api.onfinality.io/public-ws'
            };
          case Chain.ASTAR:
            return {
              chain,
              chainId,
              rpcUrl: 'wss://astar.api.onfinality.io/public-ws'
            };
        }
        break;
    }

    return {
      chain,
      chainId,
      rpcUrl: 'wss://rpc.polkadot.io'
    };
  }

  public async getRpcConnection(chain: Chain) {
    const config = this.getChainConfig(chain);
    const rpcUrl = config?.rpcUrl;
    if (this.rpcApiConnections.has(rpcUrl)) {
      return this.rpcApiConnections.get(rpcUrl);
    }

    const rpc = await PolkadotRpcService.init(rpcUrl);
    this.rpcApiConnections.set(rpcUrl, rpc);

    return rpc;
  }

  public async getAssetRpcConnection(
    asset: Asset,
    networkType?: NetworkType
  ): Promise<PolkadotRpcService> {
    const config = this.getChainConfig(asset.chain, networkType);
    const rpcUrl = config?.rpcUrl;

    if (this.rpcApiConnections.has(rpcUrl)) {
      return this.rpcApiConnections.get(rpcUrl);
    }

    const rpc = await PolkadotRpcService.init(rpcUrl);
    this.rpcApiConnections.set(rpcUrl, rpc);

    return rpc;
  }
}

export const statefulRpc = new StatefulRPC();
