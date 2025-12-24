import CryptoJS from 'crypto-js'

// 密钥
const secretKey = import.meta.env.VITE_SECRET_KEY

/**
 * @description: 加密
 * @param {string} data 需要加密的数据
 * @return {*}
 */
export const encryptAES = (data: string): string => {
  const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(secretKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

/**
 * @description: 解密
 * @param {string} cipherText 需要解密的数据
 * @return {*}
 */
export const decryptAES = (cipherText: string): string => {
  const decrypted = CryptoJS.AES.decrypt(cipherText, CryptoJS.enc.Utf8.parse(secretKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}
