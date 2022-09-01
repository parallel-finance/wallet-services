import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { BN } from '@polkadot/util';
import { addressToHex, mulDecs } from '../../../utils/xcm';
import { Chain, Networks } from '../../assets/models';
import { statefulRpc } from '../../rpc/statefulRpc';

export const reserveTransferXcm = (paraId: number, address: string, amount: string) => [
  {
    V1: {
      parents: 0,
      interior: {
        X1: {
          Parachain: paraId
        }
      }
    }
  },
  {
    V1: {
      parents: 0,
      interior: {
        X1: {
          AccountId32: {
            network: 'Any',
            id: addressToHex(address)
          }
        }
      }
    }
  },
  {
    V1: [
      {
        id: {
          Concrete: {
            parents: 0,
            interior: 'Here'
          }
        },
        fun: {
          Fungible: amount
        }
      }
    ]
  },
  0
];

export const depositToParallel = async (
  sourceNetwork: Networks,
  amount: string,
  decimals: number,
  address: string
): Promise<{
  api: ApiPromise,
  tx: SubmittableExtrinsic<'promise'>
}> => {
  const chain = Chain[sourceNetwork];
  const { api }: { api: ApiPromise } = await statefulRpc.getRpcConnection(chain);

  if (api?.tx?.xcmPallet?.reserveTransferAssets) {
    const amountToSend = mulDecs(parseFloat(amount), new BN(decimals)).toString();
    const paraId = chain;
    const payload = reserveTransferXcm(paraId, address, amountToSend);
    return {
      api,
      tx: api.tx.xcmPallet.reserveTransferAssets(...payload)
    };
  }
  console.error(
    '[TRANSFER] Depositing in a non supported Chain / Network',
    chain,
    api,
    address,
    amount
  );
  return null;
};
