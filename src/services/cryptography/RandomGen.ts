import { lib } from 'crypto-js';
import { WalletWithAssets } from '../models';

function getRandomId(bytesLen?: number): string {
  return lib.WordArray.random(bytesLen || 8).toString();
}

function getUniqueId(uniqueValidator: (id) => boolean, bytesLen?: number) {
  let generatedID = getRandomId(bytesLen);

  while (uniqueValidator(generatedID)) {
    generatedID = getRandomId(bytesLen);
  }

  return generatedID;
}

export function getRandomUniqueWalletId(
  existingWallets: Array<WalletWithAssets>,
  bytesLen?: number
): string {
  const walletIdExists = id => existingWallets.some(({ wallet }) => wallet.walletId === id);
  return getUniqueId(walletIdExists, bytesLen);
}

export function getRandomUniqueAssetId(
  existingWallets: Array<WalletWithAssets>,
  bytesLen?: number
): string {
  const assetIdExists = id =>
    existingWallets.some(({ assets }) => assets.some(asset => asset.assetId === id));

  return getUniqueId(assetIdExists, bytesLen);
}
