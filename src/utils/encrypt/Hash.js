import bcrypt from "bcrypt";

export const Hash = async ({ key, saltRound = process.env.SALT_ROUNDS }) => {
  return bcrypt.hashSync(key, Number(saltRound));
};
