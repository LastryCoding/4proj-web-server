const { create, updateOne, readAll, readOne, deleteOne, getUserCart, readOneByUserId } = require("./../../../middleware/requests");
const { validateData, reduceData, joinCarts } = require("./../reducers");
const { switchStatus } = require("../../../middleware/statusRes");
const ItemSchema = require("./../../../models/cart");

// HANDLE GET CART OF USER
exports.handleGetUserCart = async (content) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  return switchStatus(await getUserCart(ItemSchema, content.userId));
};

//CREATE
exports.handleCreateOne = async (content) => {
  const result = await this.handleGetUserCart(content);
  switch (result.status) {
    case 200:
      let dataJoined = joinCarts(content, result.message);
      return switchStatus(await this.handleUpdateOne(dataJoined, result.message._id));
    case 400:
      let dataReduced = reduceData(content);
      return switchStatus(await create(ItemSchema, dataReduced));
    default:
      return switchStatus({ ...result });
  }
};

//READ ALL
exports.handleReadAll = async () => {
  return switchStatus(await readAll(ItemSchema));
};
//READ ONE
exports.handleReadOne = async (id) => {
  return switchStatus(await readOne(ItemSchema, id));
};
//READ ONE
exports.handleReadOneByUserId = async (id) => {
  return switchStatus(await readOneByUserId(ItemSchema, id));
};
//UPDATE ONE
exports.handleUpdateOne = async (content, id) => {
  return switchStatus(await updateOne(ItemSchema, id, content));
};
// DELETE ONE
exports.handleDeleteOne = async (id) => {
  return switchStatus(await deleteOne(ItemSchema, id));
};
