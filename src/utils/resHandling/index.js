export const resHandler = (res, message, data) => {
  if (!data) {
    return res.status(201).json({ message });
  }
  return res.status(201).json({ message, ...data });
};
