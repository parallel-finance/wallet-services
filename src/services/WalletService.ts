import { WalletCreator } from './wallet/WalletCreator';
import { WalletCreationResult } from './wallet/models';
import { Networks } from './assets/models';
import { WalletWithAssets } from './models';

export class WalletService {
  public restoreWallet(
    _walletName: string,
    _phrase: string,
    _password: string,
    existingWallets: Array<WalletWithAssets>
  ): Promise<WalletCreationResult> {
    const walletImporter = new WalletCreator();
    return walletImporter.importWallet(_walletName, _phrase, _password, existingWallets);
  }

  public restoreHardwareWallet(
    _address: string,
    _walletName: string,
    existingWallets: Array<WalletWithAssets>,
    _network: Networks
  ): Promise<WalletCreationResult> {
    const walletImporter = new WalletCreator();
    return walletImporter.importHardwareWallet(_address, _walletName, existingWallets, _network);
  }

  public createWallet(
    _walletName: string,
    _password: string,
    existingWallets: Array<WalletWithAssets>
  ): Promise<WalletCreationResult> {
    const walletCreator = new WalletCreator();
    return walletCreator.createWallet(_walletName, _password, existingWallets);
  }
}
