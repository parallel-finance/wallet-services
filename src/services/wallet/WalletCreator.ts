import * as bip39 from 'bip39';
import { Wallet, WalletWithAssets, WalletSource } from '../models';
import { getRandomUniqueWalletId } from '../cryptography/RandomGen';
import { Encryptor } from '../cryptography/Encryptor';
import { Asset, LedgerNetworksDerivableMap, Networks, Chain } from '../assets/models';
import { AssetGenerator } from '../assets/AssetGenerator';
import { WalletCreationResult } from './models';
import { ASSETS_CONFIGS } from '../assets/assets.configs';

const CURVE_TYPE = 'sr25519';

export class WalletCreator {
  // @_walletName: The name assigned to the wallet
  // @_password: The password that will be used to encrypt the generated seed phrase
  public async createWallet(
    _walletName: string,
    _password,
    existingWallets: Array<WalletWithAssets>
  ): Promise<WalletCreationResult> {
    const generatedSeedPhrase = bip39.generateMnemonic();
    const encryptor = new Encryptor();

    const initialVector = await encryptor.generateIV();
    const encryptedSeed = await encryptor.encrypt(generatedSeedPhrase, _password, initialVector);

    const walletID = getRandomUniqueWalletId(existingWallets, 12);

    const initialAssets = await this.createAssets(generatedSeedPhrase, walletID, existingWallets);

    const substrateGenericAddress = await this.getSubstrateAddress(walletID, generatedSeedPhrase);

    const newWallet: Wallet = {
      derivationIndex: 0,
      encryptedPhrase: encryptedSeed.cipher,
      name: _walletName,
      walletId: walletID,
      config: {
        enabled: true,
        iv: initialVector
      },
      type: CURVE_TYPE,
      address: substrateGenericAddress,
      source: WalletSource.WEB
    };

    return {
      wallet: newWallet,
      assets: initialAssets,
      mnemonicPhrase: generatedSeedPhrase
    };
  }

  public async importWallet(
    _walletName: string,
    _existingSeedPhrase: string,
    _password: string,
    existingWallets: Array<WalletWithAssets>
  ): Promise<WalletCreationResult> {
    const encryptor = new Encryptor();
    const initialVector = await encryptor.generateIV();
    const encryptedSeed = await encryptor.encrypt(_existingSeedPhrase, _password, initialVector);

    const walletID = getRandomUniqueWalletId(existingWallets, 12);
    const initialAssets = await this.createAssets(
      _existingSeedPhrase,
      walletID,
      existingWallets,
      true
    );
    const substrateGenericAddress = await this.getSubstrateAddress(walletID, _existingSeedPhrase);

    const importedWallet: Wallet = {
      derivationIndex: 0,
      encryptedPhrase: encryptedSeed.cipher,
      name: _walletName,
      walletId: walletID,
      config: {
        enabled: true,
        iv: initialVector
      },
      address: substrateGenericAddress,
      type: CURVE_TYPE,
      source: WalletSource.WEB
    };
    return {
      wallet: importedWallet,
      assets: initialAssets,
      mnemonicPhrase: _existingSeedPhrase
    };
  }

  public async importHardwareWallet(
    _address: string,
    _walletName: string,
    existingWallets: Array<WalletWithAssets>,
    _network: Networks
  ): Promise<WalletCreationResult> {
    const encryptor = new Encryptor();
    const initialVector = await encryptor.generateIV();
    const walletID = getRandomUniqueWalletId(existingWallets, 12);
    const initialAssets = await this.createHwWalletAssets(
      _address,
      walletID,
      existingWallets,
      true,
      _network
    );
    const substrateGenericAddress = await this.getSubstrateAddress(walletID, '', _address);

    const importedWallet: Wallet = {
      derivationIndex: 0,
      encryptedPhrase: '',
      name: _walletName,
      walletId: walletID,
      config: {
        enabled: true,
        iv: initialVector
      },
      address: substrateGenericAddress,
      type: CURVE_TYPE,
      source: WalletSource.HARDWARE,
      ledgerImportedNetworks: LedgerNetworksDerivableMap[_network]
    };
    return {
      wallet: importedWallet,
      assets: initialAssets,
      mnemonicPhrase: ''
    };
  }

  private async getSubstrateAddress(
    walletID: string,
    _existingSeedPhrase: string,
    _address?: string
  ) {
    const assetGenerator = new AssetGenerator(walletID);
    return await assetGenerator.generateSubstrateGenericAddress(_existingSeedPhrase, _address);
  }

  public async createAssets(
    _phrase: string,
    walletId: string,
    existingWallets: Array<WalletWithAssets>,
    nullBalance: boolean = false
  ): Promise<Asset[]> {
    const initialAssets: Asset[] = [];
    for (const assetConfig of ASSETS_CONFIGS) {
      const assetGenerator = new AssetGenerator(walletId);
      const newAsset = await assetGenerator.generateAsset(
        _phrase,
        assetConfig,
        nullBalance,
        existingWallets
      );
      initialAssets.push(newAsset);
    }

    return initialAssets;
  }

  public async createHwWalletAssets(
    _address: string,
    walletId: string,
    existingWallets: Array<WalletWithAssets>,
    nullBalance: boolean = false,
    _network: Networks
  ): Promise<Asset[]> {
    const initialAssets: Asset[] = [];
    const allAssets = ASSETS_CONFIGS.filter(assetConfig => {
      const chains = LedgerNetworksDerivableMap[_network].map(network => Chain[network]);
      return chains.includes(assetConfig.chain);
    });
    for (const assetConfig of allAssets) {
      const assetGenerator = new AssetGenerator(walletId);
      const newAsset = await assetGenerator.generateHwWalletAsset(
        _address,
        assetConfig,
        nullBalance,
        existingWallets
      );
      initialAssets.push(newAsset);
    }

    return initialAssets;
  }
}
