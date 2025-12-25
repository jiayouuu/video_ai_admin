import { encryptAES, decryptAES } from "@/utils/crypto";
export const encStorage = {
  setItem: (key: string, value: string) => {
    const encryptedValue = encryptAES(value);
    localStorage.setItem(key, encryptedValue);
  },
  getItem: (key: string): string | null => {
    const encryptedValue = localStorage.getItem(key);
    if (encryptedValue) {
      return decryptAES(encryptedValue);
    }
    return null;
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};
