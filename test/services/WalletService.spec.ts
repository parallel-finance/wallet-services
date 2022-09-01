import { Asset, AssetType, Chain, Encryptor, WalletService } from '../../src/';
import { cryptoWaitReady } from '@polkadot/util-crypto';

const isNativeAsset = (asset: Asset) => {
  return asset.assetType === AssetType.NATIVE;
};

describe('WalletService', () => {
  const mockPassword = 'ed_331ASqaaQ$';
  beforeAll(async () => {
    await cryptoWaitReady();
  });
  it('Test creating a new Wallet', async () => {
    const walletService = new WalletService();
    const walletCreationResult = await walletService.createWallet('My Wallet 1', mockPassword, []);

    expect(walletCreationResult.wallet.name).toBe('My Wallet 1');
    expect(walletCreationResult.wallet.derivationIndex).toBe(0);
    expect(walletCreationResult.wallet.encryptedPhrase).not.toBeNull();
  });

  it('Test importing an existing Wallet', async () => {
    const walletService = new WalletService();
    const phrase =
      'recall lady bullet buyer ecology ordinary ivory husband layer away blossom achieve';
    const importedWalletResult = await walletService.restoreWallet(
      'My Wallet 1',
      phrase,
      mockPassword,
      []
    );

    expect(importedWalletResult.wallet.name).toBe('My Wallet 1');
    expect(importedWalletResult.wallet.derivationIndex).toBe(0);
    expect(importedWalletResult.wallet.encryptedPhrase).not.toBeNull();

    const encryptedSeed = importedWalletResult.wallet.encryptedPhrase;
    const encryptor = new Encryptor();

    const decryptedSeedPhrase = await encryptor.decrypt(
      encryptedSeed,
      mockPassword,
      importedWalletResult.wallet.config.iv
    );

    expect(decryptedSeedPhrase).toBe(phrase);
  });

  it('Test assets initialization', async () => {
    const phrase = 'sample split bamboo west visual approve brain fox arch impact relief smile';

    const walletService = new WalletService();

    const importedWalletResult = await walletService.restoreWallet(
      'My Wallet 1',
      phrase,
      mockPassword,
      []
    );

    expect(importedWalletResult.assets.length).toBeGreaterThan(0);

    const polkadotAsset = importedWalletResult.assets.find(
      asset => asset.chain === Chain.POLKADOT && isNativeAsset(asset)
    );
    expect(polkadotAsset.address).toBe('14H1UxqUGVmbHJ8QbCndwwVbLkGpK2u6KzML5SVa9hfywny9');
    expect(polkadotAsset.name).toBe('Polkadot');
    expect(polkadotAsset.symbol).toBe('DOT');

    const kusamaAsset = importedWalletResult.assets.find(
      asset => asset.chain === Chain.KUSAMA && isNativeAsset(asset)
    );
    expect(kusamaAsset.address).toBe('FrKzwvH35X3bQwLQGYghk2SdiZQRQA8hsTbJonB5QrxWCor');
    expect(kusamaAsset.name).toBe('Kusama');
    expect(kusamaAsset.symbol).toBe('KSM');

    const parallelAsset = importedWalletResult.assets.find(asset => {
      return asset.chain === Chain.PARALLEL && isNativeAsset(asset);
    });
    expect(parallelAsset.address).toBe('p8EDZtPoKjxpwVBZLNx5FKtKSi1MRhAeTJXBpXvtwA3Lcx21v');
    expect(parallelAsset.name).toBe('Parallel');
    expect(parallelAsset.symbol).toBe('PARA');

    const heikoAsset = importedWalletResult.assets.find(asset => {
      return asset.chain === Chain.HEIKO && isNativeAsset(asset);
    });
    expect(heikoAsset.address).toBe('hJJUADmPWjWQskGJcSMLzzB3JCdvdux98pGxqHnzDu5unDoEc');
    expect(heikoAsset.name).toBe('Parallel Heiko');
    expect(heikoAsset.symbol).toBe('HKO');
  });

  it('Test Substrate generic address generation', async () => {
    const phrase = 'sample split bamboo west visual approve brain fox arch impact relief smile';
    const walletService = new WalletService();

    const importedWalletResult = await walletService.restoreWallet(
      'My Wallet 1',
      phrase,
      mockPassword,
      []
    );

    expect(importedWalletResult.wallet.address).toBe(
      '5FLiLdaQQiW7qm7tdZjdonfSV8HAcjLxFVcqv9WDbceTmBXA'
    );
  });
});
