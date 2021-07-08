const { create, updateOne, readAll, readOne, deleteOne } = require("../../../middleware/requests");
const { validateData, reduceData } = require("../reducers");
const { switchStatus } = require("../../../middleware/statusRes");
const ItemSchema = require("./../../../models/items");

//CREATE
exports.handleCreateOne = async (content) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  let dataReduced = reduceData(content);
  return switchStatus(await create(ItemSchema, dataReduced));
};
//READ ALL
exports.handleReadAll = async () => {
  return switchStatus(await readAll(ItemSchema));
};
//READ ONE
exports.handleReadOne = async (id) => {
  return switchStatus(await readOne(ItemSchema, id));
};
//UPDATE ONE
exports.handleUpdateOne = async (content, id) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  let dataReduced = reduceData(content);
  return switchStatus(await updateOne(ItemSchema, id, dataReduced));
};
// DELETE ONE
exports.handleDeleteOne = async (id) => {
  return switchStatus(await deleteOne(ItemSchema, id));
};
