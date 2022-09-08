import { EncryptedCredential } from '../cryptography/models';
import { Encryptor } from '../cryptography/Encryptor';

class CredentialService {
  public async hashPassword(password: string): Promise<EncryptedCredential> {
    const encryptor = new Encryptor();
    const salt = encryptor.generateSalt();
    return encryptor.computeHash(password, salt);
  }

  public async checkIfPasswordIsValid(
    inputPassword: string,
    savedHashedPassword: EncryptedCredential
  ): Promise<boolean> {
    const encryptor = new Encryptor();

    const { salt } = savedHashedPassword;
    const hashResult = encryptor.computeHash(inputPassword, salt);
    return hashResult.data === savedHashedPassword.data;
  }
}

export const credentialService = new CredentialService();
