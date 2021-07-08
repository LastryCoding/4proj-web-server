const { create, updateOne, readAll, readOne, deleteOne } = require("../../../middleware/requests");
const { validateData, reduceData } = require("../reducers");
const { switchStatus } = require("../../../middleware/statusRes");
const transactionSchema = require("./../../../models/transactionsFournisseur");

//CREATE
exports.handleCreateOne = async (content) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  let dataReduced = reduceData(content);
  return switchStatus(await create(transactionSchema, dataReduced));
};
//READ ALL
exports.handleReadAll = async () => {
  return switchStatus(await readAll(transactionSchema));
};
//READ ONE
exports.handleReadOne = async (id) => {
  return switchStatus(await readOne(transactionSchema, id));
};
//UPDATE ONE
exports.handleUpdateOne = async (content, id) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  let dataReduced = reduceData(content);
  return switchStatus(await updateOne(transactionSchema, id, dataReduced));
};
// DELETE ONE
exports.handleDeleteOne = async (id) => {
  return switchStatus(await deleteOne(transactionSchema, id));
};
