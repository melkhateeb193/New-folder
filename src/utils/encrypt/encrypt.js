import CryptoJS from "crypto-js";

export const Encrypt = async ({
  key,
  signature = process.env.ENCRYPT_SECRET_KEY,
}) => {
  return CryptoJS.AES.encrypt(key, signature).toString();
};
