import CryptoJS from "crypto-js";

export const Decrypt = async ({
  encrypted,
  signature = process.env.ENCRYPT_SECRET_KEY,
}) => {
  return CryptoJS.AES.decrypt(encrypted, signature).toString(CryptoJS.enc.Utf8);
};
