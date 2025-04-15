import * as Crypto from 'expo-crypto';

export const hashPassword = async (plainText: string): Promise<string> => {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    plainText
  );
  return hash;
};