export const Pagination = async ({
  page = 1,
  limit = 2,
  model,
  populate,
} = {}) => {
  let Page = parseInt(page) || 1;
  if (Page < 1) Page = 1;
  const Limit = parseInt(limit) || 2;
  const skip = (Page - 1) * Limit;

  const data = await model.find({}).limit(Limit).skip(skip).populate(populate);

  return { Page, data };
};
