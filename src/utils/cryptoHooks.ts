import CryptoJS from 'crypto-js';
const NEXT_PUBLIC_CRYPTOJS_SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTOJS_SECRET_KEY;

export const useEncryptValue = (value: string) => {
  if (NEXT_PUBLIC_CRYPTOJS_SECRET_KEY !== undefined) {
    return CryptoJS.AES.encrypt(value, NEXT_PUBLIC_CRYPTOJS_SECRET_KEY).toString();
  } else {
    throw new Error('El servidor no posee una Secret Key');
  }
};

export const useDecryptValue = (value: string) => {
  if (NEXT_PUBLIC_CRYPTOJS_SECRET_KEY !== undefined) {
    const decryptedBytes = CryptoJS.AES.decrypt(value, NEXT_PUBLIC_CRYPTOJS_SECRET_KEY);
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
  } else {
    throw new Error('El servidor no posee una Secret Key');
  }
};
