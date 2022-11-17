import { Chain, NetworkType } from './../services/assets/models';

type ChainsDetail = Record<
  Exclude<Chain, Chain.SUBSTRATE>, // No rpcUrl config for the SUBSTRATE chain
  {
    rpcUrl: string;
    addressPrefix?: string;
  }
>;

export const MainnetChainsDetail: ChainsDetail = {
  [Chain.PARALLEL]: {
    rpcUrl: 'wss://rpc.parallel.fi'
  },
  [Chain.HEIKO]: {
    rpcUrl: 'wss://heiko-rpc.parallel.fi'
  },
  [Chain.PARALLEL_RELAY]: {
    rpcUrl: 'wss://polkadot-rpc.parallel.fi'
  },
  [Chain.HEIKO_RELAY]: {
    rpcUrl: 'wss://kusama-rpc.parallel.fi'
  },
  [Chain.ETH]: {
    rpcUrl: '' // have not support the ETH chain.
  },
  [Chain.POLKADOT]: {
    rpcUrl: 'wss://rpc.polkadot.io'
  },
  [Chain.KUSAMA]: {
    rpcUrl: 'wss://kusama-rpc.polkadot.io'
  },
  [Chain.ACALA]: {
    rpcUrl: 'wss://acala-polkadot.api.onfinality.io/public-ws'
  },
  [Chain.MOONBEAM]: {
    rpcUrl: 'wss://moonbeam.api.onfinality.io/public-ws'
  },
  [Chain.MOONRIVER]: {
    rpcUrl: 'wss://moonriver.api.onfinality.io/public-ws'
  },
  [Chain.KARURA]: {
    rpcUrl: 'wss://karura.api.onfinality.io/public-ws'
  },
  [Chain.ASTAR]: {
    rpcUrl: 'wss://astar.api.onfinality.io/public-ws'
  },
  [Chain.INJECTIVE]: {
    rpcUrl: 'https://rpc-test.osmosis.zone', // TODO should update the injective test rpc
    addressPrefix: 'osmo'
  }
};

// https://www.notion.so/parallelfinance/Polkadot-3e8cdb70b3504623b83ba4dbfa8fbd8b
export const TestnetChainsDetail: ChainsDetail = {
  [Chain.PARALLEL]: {
    rpcUrl: 'wss://regnet2-rpc.parallel.fi'
  },
  [Chain.HEIKO]: {
    rpcUrl: 'wss://regnet-rpc.parallel.fi'
  },
  [Chain.PARALLEL_RELAY]: {
    rpcUrl: 'wss://regnet2-relay-rpc.parallel.fi'
  },
  [Chain.HEIKO_RELAY]: {
    rpcUrl: 'wss://regnet-relay-rpc.parallel.fi'
  },
  [Chain.ETH]: {
    rpcUrl: '' // have not support the ETH chain.
  },
  [Chain.POLKADOT]: {
    rpcUrl: 'wss://regnet2-relay-rpc.parallel.fi'
  },
  [Chain.KUSAMA]: {
    rpcUrl: 'wss://regnet-relay-rpc.parallel.fi'
  },
  [Chain.ACALA]: {
    rpcUrl: 'wss://acala-polkadot.api.onfinality.io/public-ws'
  },
  [Chain.MOONBEAM]: {
    rpcUrl: 'wss://moonbeam-alpha.api.onfinality.io/public-ws'
  },
  [Chain.MOONRIVER]: {
    rpcUrl: 'wss://moonriver.api.onfinality.io/public-ws'
  },
  [Chain.KARURA]: {
    rpcUrl: 'wss://karura.api.onfinality.io/public-ws'
  },
  [Chain.ASTAR]: {
    rpcUrl: 'wss://astar.api.onfinality.io/public-ws'
  },
  [Chain.INJECTIVE]: {
    rpcUrl: 'https://rpc-test.osmosis.zone', // TODO should update the injective test rpc,
    addressPrefix: 'osmo'
  }
};

export const chainsDetail: Record<NetworkType, ChainsDetail> = {
  [NetworkType.MAINNET]: MainnetChainsDetail,
  [NetworkType.TESTNET]: TestnetChainsDetail
};
