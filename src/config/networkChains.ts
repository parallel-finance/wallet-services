import { Chain, Networks } from '../';

export const NETWORK_LIST = [
  {
    label: 'All Chains',
    value: 'ALL',
    supportLedgerImport: false,
    supportLedgerSigning: false,
    chain: [
      Chain.POLKADOT,
      Chain.PARALLEL,
      Chain.KUSAMA,
      Chain.HEIKO,
      Chain.ACALA,
      Chain.MOONBEAM,
      Chain.MOONRIVER,
      Chain.KARURA,
      Chain.ASTAR
    ]
  },
  {
    label: 'Polkadot',
    value: Networks.POLKADOT,
    supportLedgerImport: true,
    supportLedgerSigning: true,
    chain: [Chain.POLKADOT]
  },
  {
    label: 'Parallel',
    value: Networks.PARALLEL,
    supportLedgerImport: true,
    supportLedgerSigning: true,
    chain: [Chain.PARALLEL]
  },
  {
    label: 'Kusama',
    value: Networks.KUSAMA,
    supportLedgerImport: true,
    supportLedgerSigning: true,
    chain: [Chain.KUSAMA]
  },
  {
    label: 'Heiko',
    value: Networks.HEIKO,
    supportLedgerImport: false,
    supportLedgerSigning: false,
    chain: [Chain.HEIKO]
  },
  {
    label: 'Acala',
    value: Networks.ACALA,
    supportLedgerImport: true,
    supportLedgerSigning: true,
    chain: [Chain.ACALA]
  },
  {
    label: 'Moonbeam',
    value: Networks.MOONBEAM,
    supportLedgerImport: false,
    supportLedgerSigning: false,
    chain: [Chain.MOONBEAM]
  },
  {
    label: 'Moonriver',
    value: Networks.MOONRIVER,
    supportLedgerImport: false,
    supportLedgerSigning: false,
    chain: [Chain.MOONRIVER]
  },
  {
    label: 'Astar',
    value: Networks.ASTAR,
    supportLedgerImport: false,
    supportLedgerSigning: false,
    chain: [Chain.ASTAR]
  },
  {
    label: 'Karura',
    value: Networks.KARURA,
    supportLedgerImport: true,
    supportLedgerSigning: true,
    chain: [Chain.KARURA]
  }
];
