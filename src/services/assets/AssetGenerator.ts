import { Asset, AssetConfig, AssetType, Chain } from './models';
import { Keyring } from '@polkadot/keyring';
import { getRandomUniqueAssetId } from '../cryptography/RandomGen';
import { cryptoIsReady, cryptoWaitReady } from '@polkadot/util-crypto';
import { WalletWithAssets } from '../models';
import { getKeyringPair } from '../../utils/crypto';
export class AssetGenerator {
  public walletId: string;

  constructor(walletId: string) {
    this.walletId = walletId;
  }

  async generateAsset(
    _phrase: string,
    assetConfig: AssetConfig,
    nullBalance: boolean,
    existingWallets: Array<WalletWithAssets>
  ): Promise<Asset> {
    await this.checkOnCryptoModule();
    const { ss58Value, accountPublicKey, address } = this.createAddress(assetConfig, _phrase);
    const assetId = getRandomUniqueAssetId(existingWallets, assetConfig.decimals);

    return {
      address,
      assetId,
      assetType: assetConfig.assetType,
      balances: nullBalance
        ? null
        : {
            total: '0',
            democracy: '0',
            redeemable: '0',
            transferrable: '0',
            locked: '0',
            bonded: '0',
            reserved: '0'
          },
      chain: assetConfig.chain,
      decimals: assetConfig.decimals,
      iconUrl: '',
      name: assetConfig.name,
      publicKey: accountPublicKey,
      symbol: assetConfig.symbol,
      walletId: this.walletId,
      tokenId: assetConfig.tokenId || String(ss58Value),
      accountType: assetConfig.account
    };
  }

  async generateHwWalletAsset(
    _address: string,
    assetConfig: AssetConfig,
    nullBalance: boolean,
    existingWallets: Array<WalletWithAssets>
  ): Promise<Asset> {
    await this.checkOnCryptoModule();
    const { ss58Value, accountPublicKey, address } = this.createAddress(assetConfig, '', _address);
    const assetId = getRandomUniqueAssetId(existingWallets, assetConfig.decimals);

    return {
      address,
      assetId,
      assetType: assetConfig.assetType,
      balances: nullBalance
        ? null
        : {
            total: '0',
            democracy: '0',
            redeemable: '0',
            transferrable: '0',
            locked: '0',
            bonded: '0',
            reserved: '0'
          },
      chain: assetConfig.chain,
      decimals: assetConfig.decimals,
      iconUrl: '',
      name: assetConfig.name,
      publicKey: accountPublicKey,
      symbol: assetConfig.symbol,
      walletId: this.walletId,
      tokenId: assetConfig.tokenId || String(ss58Value),
      accountType: assetConfig.account
    };
  }

  private createAddress(
    assetConfig: AssetConfig,
    _phrase: string,
    _address?: string
  ): AddressGenerationResult {
    const ss58Value = assetConfig.chain.valueOf();

    // if address is provided we derive keyring pair from it otherwise we derive from phrase
    let keyringPair;
    if (_address) {
      const keyring = new Keyring({ type: 'sr25519' });
      keyring.setSS58Format(ss58Value);
      keyringPair = keyring.addFromAddress(_address);
    } else {
      keyringPair = getKeyringPair(assetConfig.account, ss58Value, _phrase);
    }

    const accountPublicKey = Buffer.from(keyringPair.publicKey).toString('hex');
    const address = keyringPair.address;

    return { accountPublicKey, address, ss58Value };
  }

  public async generateSubstrateGenericAddress(_phrase: string, _address?: string) {
    const config: AssetConfig = {
      chain: Chain.SUBSTRATE,
      decimals: 10,
      name: 'Substrate Network',
      symbol: 'Substrate',
      assetType: AssetType.NATIVE
    };
    const substrate = await this.createAddress(config, _phrase, _address);
    return substrate.address;
  }

  public async checkOnCryptoModule() {
    const isCryptoModuleLoaded = cryptoIsReady();

    if (!isCryptoModuleLoaded) {
      await cryptoWaitReady();
    }
  }
}

export interface AddressGenerationResult {
  address: string;
  ss58Value: number;
  accountPublicKey: string;
}
