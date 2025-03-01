export const pagination = async ({
  model,
  filter = {},
  populate = [],
  page = 0,
  sort = {},
  limit = 100,
  select = {},
} = {}) => {
  let Page = parseInt(page) || 1;
  if (Page < 1) Page = 1;
  const Limit = parseInt(limit) || 2;
  const skip = (Page - 1) * Limit;

  const data = await model
    .find(filter)
    .limit(Limit)
    .skip(skip)
    .sort(sort)
    .populate(populate)
    .select(select);

  const count = await model.find(filter);

  const totalCount = count.length;

  return { Page, totalCount, data };
};

//------------------------------------------------------------------------------

export const create = async ({ model, query = {} } = {}) => {
  return await model.create(query);
};

//------------------------------------------------------------------------------

export const findById = async ({ model, id = {}, populate = [] } = {}) => {
  return await model.findById(id).populate(populate);
};

//------------------------------------------------------------------------------

export const findOne = async ({
  model,
  filter = {},
  populate = [],
  skip = 0,
  limit = 100,
  select = "",
} = {}) => {
  return await model
    .findOne(filter)
    .populate(populate)
    .select(select)
    .skip(skip)
    .limit(limit);
};

//------------------------------------------------------------------------------

export const find = async ({
  model,
  filter = {},
  populate = [],
  skip = 0,
  limit = 100,
  select = {},
} = {}) => {
  return await model
    .find(filter)
    .populate(populate)
    .skip(skip)
    .limit(limit)
    .select(select);
};

//------------------------------------------------------------------------------

export const findMany = async ({
  model,
  filter = {},
  populate = [],
  skip = 0,
  limit = 100,
  select = "",
} = {}) => {
  return await model
    .find(filter)
    .populate(populate)
    .skip(skip)
    .limit(limit)
    .select(select);
};

//------------------------------------------------------------------------------

export const updateOne = async ({ model, filter = {}, update = {} } = {}) => {
  return await model.updateOne(filter, update);
};

//------------------------------------------------------------------------------

export const updateMany = async ({ model, filter = {}, update = {} } = {}) => {
  return await model.updateMany(filter, update);
};

//------------------------------------------------------------------------------

export const findByIdAndUpdate = async ({
  model,
  id,
  update = {},
  options = {},
} = {}) => {
  return await model.findByIdAndUpdate(id, update, options);
};

//------------------------------------------------------------------------------

export const findByIdAndDelete = async ({ model, id } = {}) => {
  return await model.findByIdAndDelete(id);
};

//------------------------------------------------------------------------------

export const findOneAndUpdate = async ({
  model,
  filter = {},
  update = {},
  options = { new: true },
  populate = [],
} = {}) => {
  return await model
    .findOneAndUpdate(filter, update, options)
    .populate(populate);
};

//------------------------------------------------------------------------------

export const findOneAndDelete = async ({ model, filter = {} } = {}) => {
  return await model.findOneAndDelete(filter);
};

//------------------------------------------------------------------------------

export const deleteOne = async ({ model, filter = {} } = {}) => {
  return await model.deleteOne(filter);
};

//------------------------------------------------------------------------------

export const deleteMany = async ({ model, filter = {} } = {}) => {
  return await model.deleteMany(filter);
};

//------------------------------------------------------------------------------

export const countDocuments = async ({ model, filter = {} } = {}) => {
  return await model.countDocuments(filter);
};

//------------------------------------------------------------------------------

export const aggregate = async ({ model, pipeline = [] } = {}) => {
  return await model.aggregate(pipeline);
};

//------------------------------------------------------------------------------

export const distinct = async ({ model, field, filter = {} } = {}) => {
  return await model.distinct(field, filter);
};
