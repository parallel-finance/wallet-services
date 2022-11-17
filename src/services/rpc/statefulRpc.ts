import { CosmosRpcService } from './CosmosRpcService';
import { Asset, Chain, ChainConfig, NetworkType } from '../assets/models';
import { PolkadotRpcService } from './PolkadotRpcService';
import { chainsDetail } from '../../config/chainsDetail';

class StatefulRPC {
  rpcApiConnections = new Map();

  public getChainConfig(chain: Chain, networkType?: NetworkType): ChainConfig {
    const network = networkType || NetworkType.MAINNET;
    const chainId = `${chain.valueOf()}`;
    const chainDetail = chainsDetail[network][chain];

    return {
      chain,
      chainId,
      ...chainDetail
    };
  }

  public async getRpcConnection(chain: Chain, networkType?: NetworkType) {
    const config = this.getChainConfig(chain, networkType);
    const rpcUrl = config.rpcUrl;
    let connection;

    if (this.rpcApiConnections.has(rpcUrl) && this.rpcApiConnections.get(rpcUrl)) {
      return this.rpcApiConnections.get(rpcUrl);
    }
    switch (chain) {
      case Chain.INJECTIVE: {
        connection = await CosmosRpcService.init(rpcUrl);
        break;
      }
      default: {
        connection = await PolkadotRpcService.init(rpcUrl);
      }
    }

    this.rpcApiConnections.set(rpcUrl, connection);
    return connection;
  }

  public async getAssetRpcConnection(
    asset: Asset,
    networkType?: NetworkType
  ): Promise<PolkadotRpcService | CosmosRpcService> {
    const chain = asset.chain;
    return await this.getRpcConnection(chain, networkType);
  }
}

export const statefulRpc = new StatefulRPC();
