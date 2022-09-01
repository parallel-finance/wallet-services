import { cryptoWaitReady } from '@polkadot/util-crypto';
import { SignerPayloadRaw } from '@polkadot/types/types';
import { Chain, customTypeSigner } from '../../src/';

describe('Signing Tests', () => {
  beforeAll(async () => {
    await cryptoWaitReady();
  });

  it('Test signing payload json data', async () => {
    const phrase = 'sample split bamboo west visual approve brain fox arch impact relief smile';

    const rawPayload = {
      address: '5Ggap6soAPaP5UeNaiJsgqQwdVhhNnm6ez7Ba1w9jJ62LM2Q',
      blockHash: '0xcf69b7935b785f90b22d2b36f2227132ef9c5dd33db1dbac9ecdafac05bf9476',
      blockNumber: '0x0036269a',
      era: '0xa501',
      genesisHash: '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e',
      method: '0x0400cc4e0e2848c488896dd0a24f153070e85e3c83f6199cfc942ab6de29c56c2d7b0700d0ed902e',
      nonce: '0x00000003',
      signedExtensions: [
        'CheckSpecVersion',
        'CheckTxVersion',
        'CheckGenesis',
        'CheckMortality',
        'CheckNonce',
        'CheckWeight',
        'ChargeTransactionPayment'
      ],
      specVersion: '0x0000002d',
      tip: '0x00000000000000000000000000000000',
      transactionVersion: '0x00000003',
      version: 4
    };

    const signResult = await customTypeSigner.signPayloadJSON(phrase, rawPayload);
    expect(signResult.signature).not.toBeNull();
    expect(signResult.id).not.toBeNull();
  });

  it('Test signing raw payload data', async () => {
    const phrase = 'sample split bamboo west visual approve brain fox arch impact relief smile';

    const rawPayload: SignerPayloadRaw = {
      data: '0x01caff134e595d3d3a8d94c005e7880f8ffce6edb2a5d819ace5e9e4afaf18f81b1e0d7bf04cfe1b967c7c0401fb66f54e888df58d98b22b07d921a13ac07de080',
      type: 'bytes',
      address: '5Ggap6soAPaP5UeNaiJsgqQwdVhhNnm6ez7Ba1w9jJ62LM2Q'
    };

    const signResult = await customTypeSigner.signRawPayload(phrase, rawPayload, Chain.PARALLEL);
    expect(signResult.signature).not.toBeNull();
    expect(signResult.id).not.toBeNull();
  });
});
