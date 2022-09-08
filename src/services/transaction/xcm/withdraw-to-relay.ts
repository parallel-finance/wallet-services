import { BN } from '@polkadot/util';
import { ApiPromise } from '@polkadot/api';
import { addressToHex, mulDecs } from '../../../utils/xcm';
import { ASSETS_CONFIGS, NATIVE_TOKENS } from '../../assets/assets.configs';
import { Chain, Networks } from '../../assets/models';
import { statefulRpc } from '../../rpc/statefulRpc';
import { SubmittableExtrinsic } from '@polkadot/api/types';

export const createXcmVersionedMultiLocation = (address: string) => ({
  V1: {
    parents: 1,
    interior: {
      X1: {
        AccountId32: {
          network: 'Any',
          id: addressToHex(address)
        }
      }
    }
  }
});

// @ts-ignore
export const withdrawToRelay = async (
  sourceNetwork: Networks,
  targetNetwork: Networks,
  amount: string,
  address: string
): Promise<{
  api: ApiPromise;
  tx: SubmittableExtrinsic<'promise'>;
}> => {
  const chain = Chain[sourceNetwork];
  const { api }: { api: ApiPromise } = await statefulRpc.getRpcConnection(chain);

  if (api?.tx?.xTokens?.transfer) {
    const assetConfig = ASSETS_CONFIGS.find(
      asset => asset.symbol === NATIVE_TOKENS[targetNetwork] && asset.tokenId
    );

    const transferAmount = mulDecs(
      parseFloat(amount) || 0,
      new BN(assetConfig!.decimals)
    ).toString();

    const weightAndED = 1e10;

    return {
      api,
      tx: api.tx.xTokens.transfer(
        assetConfig?.tokenId,
        transferAmount,
        createXcmVersionedMultiLocation(address),
        weightAndED
      )
    };
  }

  console.error(
    '[TRANSFER] Withdrawing in a non supported Chain / Network',
    chain,
    api,
    address,
    amount
  );

  return null;
};
