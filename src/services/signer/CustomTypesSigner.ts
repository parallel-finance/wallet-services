import { Chain } from '../assets/models';
import { Keyring } from '@polkadot/keyring';
import { SignerPayloadRaw } from '@polkadot/types/types';
import { ResponseSigning } from './models';
import { u8aToHex, u8aWrapBytes } from '@polkadot/util';
import { getCustomSignerId } from './CustomSignId';
import { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';
import { TypeRegistry } from '@polkadot/types';

export class CustomTypesSigner {
  public registry: TypeRegistry;

  constructor() {
    this.registry = new TypeRegistry();
  }

  private getSigningKey(_chain: Chain, _phrase: string) {
    const keyring = new Keyring({ type: 'sr25519' });
    const ss58Value = _chain.valueOf();

    keyring.setSS58Format(ss58Value);
    return keyring.addFromMnemonic(_phrase);
  }

  async signRawPayload(
    phrase: string,
    payload: SignerPayloadRaw,
    chain: Chain = Chain.SUBSTRATE
  ): Promise<ResponseSigning> {
    const signingKey = this.getSigningKey(chain, phrase);
    const rawSignature = u8aToHex(signingKey.sign(u8aWrapBytes(payload.data)));

    return Promise.resolve({
      id: getCustomSignerId(),
      signature: rawSignature
    });
  }

  async signPayloadJSON(
    phrase: string,
    payload: SignerPayloadJSON,
    chain: Chain = Chain.SUBSTRATE
  ): Promise<ResponseSigning> {
    const signingKey = this.getSigningKey(chain, phrase);

    this.registry.setSignedExtensions(payload.signedExtensions);
    const signResult = this.registry
      .createType('ExtrinsicPayload', payload, { version: payload.version })
      .sign(signingKey);

    return Promise.resolve({
      id: getCustomSignerId(),
      signature: signResult.signature
    });
  }
}

export const customTypeSigner = new CustomTypesSigner();
